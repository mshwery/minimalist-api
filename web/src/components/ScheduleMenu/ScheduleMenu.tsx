import React from 'react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { Calendar, Clock, FastForward, Sunrise, Slash } from 'react-feather'
import { Icon, scale, colors, Text, Menu, MenuItem, MenuButton, useMenuState } from '../../base-ui'

dayjs.extend(calendar)

const calendarFormat = {
  sameDay: '[Today]', // The same day ( Today )
  nextDay: '[Tomorrow]', // The next day ( Tomorrow )
  nextWeek: '[Next] dddd', // The next week ( Next Sunday )
  lastDay: '[Yesterday]', // The day before ( Yesterday )
  lastWeek: '[Last] dddd', // Last week ( Last Monday )
  sameElse: 'ddd, MMM D', // Everything else ( Tue, Jun 1 )
}

interface Props {
  due?: string | null
  onSchedule: (due: null | Date) => void
}

export const ScheduleMenu: React.FunctionComponent<Props> = ({ due, onSchedule }) => {
  const menu = useMenuState({ placement: 'top', gutter: scale(0.5) })
  const trigger = due ? (
    <MenuButton {...menu} as={Text} size={300} marginTop={1} color={colors.text.muted}>
      {dayjs(due).calendar(undefined, calendarFormat)}
    </MenuButton>
  ) : (
    <MenuButton {...menu} as={Icon} icon={Calendar} isInteractive color={colors.fill.secondary} />
  )

  return (
    <>
      {trigger}
      <Menu {...menu} aria-label="Schedule Menu">
        <MenuItem
          {...menu}
          onClick={() => {
            const due = dayjs().endOf('day').toDate()
            onSchedule(due)
            menu.hide()
          }}
        >
          <Icon icon={Clock} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit">Today</Text>
        </MenuItem>
        <MenuItem
          {...menu}
          onClick={() => {
            const due = dayjs().add(1, 'day').endOf('day').toDate()
            onSchedule(due)
            menu.hide()
          }}
        >
          <Icon icon={Sunrise} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit">Tomorrow</Text>
        </MenuItem>
        <MenuItem
          {...menu}
          onClick={() => {
            const due = dayjs().endOf('week').add(1, 'day').endOf('day').toDate()
            onSchedule(due)
            menu.hide()
          }}
        >
          <Icon icon={FastForward} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit">Next week</Text>
        </MenuItem>
        <MenuItem
          {...menu}
          onClick={() => {
            onSchedule(null)
            menu.hide()
          }}
        >
          <Icon icon={Slash} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit">No due date</Text>
        </MenuItem>
      </Menu>
    </>
  )
}
