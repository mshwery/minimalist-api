import { BadRequest, Forbidden, NotFound, Unauthorized } from 'http-errors'
import { get } from 'lodash'
import { getCustomRepository } from 'typeorm'
import config from '../../../config'
import analytics from '../../lib/analytics'
import { isEmail } from '../../lib/is-email'
import { sendEmail } from '../../lib/mailer'
import { Viewer, UUID } from '../../types'
import List from './list.entity'
import ListRepository from './list.repository'
import { ListStatus } from '../../graphql/types'
import { UserModel, User, UserRepository } from '../user'

export { List, ListRepository }

export function canViewList(viewer: Viewer, list: List): boolean {
  // It's possible that when given a `task.list` there is no associated List, so we need to account for that here
  if (!viewer) {
    return false
  }

  if (list.createdBy === viewer) {
    return true
  }

  // List is shared with the user
  if (Array.isArray(list.users) && list.users.find((u) => u.id === viewer)) {
    return true
  }

  return false
}

export function canEditList(viewer: Viewer, list: List): boolean {
  // for now we'll the same users who can view a list can edit it
  return canViewList(viewer, list)
}

export class ListModel {
  /**
   * Gets a list if the viewer has access to it
   */
  static async fetch(viewer: Viewer, id: UUID, options?: { withTasks?: boolean }): Promise<List | null> {
    if (!viewer) {
      return null
    }

    const list = get(options, 'withTasks')
      ? await getCustomRepository(ListRepository).findWithTasks(id)
      : await getCustomRepository(ListRepository).findOne(id, { relations: ['users'] })

    if (!list) {
      return null
    }

    return canViewList(viewer, list) ? list : null
  }

  /**
   * Get the list owner/creator
   */
  static async fetchCreator(_viewer: Viewer, list: List): Promise<User> {
    return getCustomRepository(UserRepository).findOneOrFail({ id: list.createdBy })
  }

  /**
   * Get all lists for the viewer
   */
  static async fetchAllByViewer(viewer: Viewer, args: { status?: ListStatus } = {}): Promise<List[]> {
    if (!viewer) {
      return []
    }

    return getCustomRepository(ListRepository).allByViewer(viewer, args)
  }

  /**
   * Creates a list for the viewer given some attributes
   * @todo validate `attrs.name`
   */
  static async create(viewer: Viewer, attrs: { name: string }): Promise<List> {
    if (!viewer) {
      throw new Unauthorized(`Must be logged in create lists.`)
    }

    const repo = getCustomRepository(ListRepository)
    const list = repo.create({
      name: attrs.name,
      createdBy: viewer,
    })

    const newList = await repo.save(list)

    analytics.track({
      event: 'List Created',
      userId: viewer,
      properties: {
        listId: newList.id,
        createdBy: viewer,
      },
    })

    return newList
  }

  /**
   * Updates a list for the viewer given some attributes
   * @todo validate `attrs`
   */
  static async update(viewer: Viewer, id: UUID, attrs: Partial<List>): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    const repo = getCustomRepository(ListRepository)
    repo.merge(list, attrs)

    return repo.save(list)
  }

  /**
   * Archives a list for the viewer
   */
  static async archive(viewer: Viewer, id: UUID): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    return getCustomRepository(ListRepository)
      .archive(list)
      .then((l) => {
        analytics.track({
          event: 'List Archived',
          userId: viewer!,
          properties: {
            listId: l.id,
          },
        })

        return l
      })
  }

  /**
   * Unarchives a list for the viewer
   */
  static async unarchive(viewer: Viewer, id: UUID): Promise<List> {
    const list = await ListModel.fetch(viewer, id)
    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    return getCustomRepository(ListRepository)
      .unarchive(list)
      .then((l) => {
        analytics.track({
          event: 'List Unarchived',
          userId: viewer!,
          properties: {
            listId: l.id,
          },
        })

        return l
      })
  }

  /**
   * Deletes a list if the viewer has access
   */
  static async delete(viewer: Viewer, id: UUID): Promise<void> {
    const list = await ListModel.fetch(viewer, id)

    // viewer can only delete their own lists
    if (!list || !canEditList(viewer, list) || list.createdBy !== viewer) {
      throw new Forbidden(`Cannot delete lists that you don't have access to.`)
    }

    await getCustomRepository(ListRepository).delete(id)

    analytics.track({
      event: 'List Deleted',
      userId: viewer,
      properties: {
        listId: list.id,
      },
    })
  }

  /**
   * Adds a user (by email) to a list
   */
  static async addUser(viewer: Viewer, id: UUID, email: string): Promise<List> {
    if (!email || !email.trim() || !isEmail(email)) {
      throw new BadRequest(`Valid email is required.`)
    }

    const list = await ListModel.fetch(viewer, id)

    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    if (list.createdBy !== viewer) {
      throw new Forbidden(`You cannot add users to lists you do not own.`)
    }

    const added = await getCustomRepository(ListRepository).addUserToList(email, id)
    if (added) {
      // This should always return a user model. If it doesn't there is a problem!
      const owner = (await UserModel.fetchByViewer(viewer))!

      // Send email to added user
      await sendEmail({
        to: email,
        replyTo: {
          email: owner.email,
          name: owner.name,
        },
        category: 'collaboration',
        template: 'invite-to-list',
        data: {
          invitedBy: owner.name || owner.email,
          invitedByImage: owner.image,
          listName: list.name,
          listLink: `${config.get('APP_DOMAIN')}/lists/${list.id}`,
        },
      })

      analytics.track({
        event: 'Added User To List',
        userId: viewer,
        properties: {
          listId: list.id,
          invited: email,
        },
      })
    }

    return list
  }

  /**
   * Removes a user from a list
   */
  static async removeUser(viewer: Viewer, id: UUID, email: string): Promise<List> {
    const list = await ListModel.fetch(viewer, id)

    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    const user = await UserModel.findByEmail(viewer, email)

    // If there is no corresponding user, don't signal that to consumers, just return as if it was successful
    if (user) {
      const isRemovingSomeoneElse = viewer !== user.id
      const isViewerOwner = viewer === list.createdBy
      const isRemovingOwner = list.createdBy === user.id

      if (isRemovingOwner) {
        throw new Forbidden(`You cannot remove the list owner from a list.`)
      }

      // You can only remove yourself when you aren't the list owner
      if (isRemovingSomeoneElse && !isViewerOwner) {
        throw new Forbidden(`You cannot remove users from lists you do not own.`)
      }

      await getCustomRepository(ListRepository).removeUserFromList(user.id!, id)

      analytics.track({
        event: 'Removed User From List',
        userId: viewer!,
        properties: {
          listId: list.id,
          uninvited: email,
        },
      })
    }

    return list
  }

  /**
   * Removes the viewer from a list
   */
  static async leaveList(viewer: Viewer, id: UUID): Promise<List> {
    const list = await ListModel.fetch(viewer, id)

    if (!list) {
      throw new NotFound(`No list found with id "${id}"`)
    }

    if (list.createdBy === viewer) {
      throw new Forbidden(`You cannot leave a list you own.`)
    }

    await getCustomRepository(ListRepository).removeUserFromList(viewer!, id)

    analytics.track({
      event: 'Left List',
      userId: viewer!,
      properties: {
        listId: list.id,
      },
    })

    return list
  }
}
