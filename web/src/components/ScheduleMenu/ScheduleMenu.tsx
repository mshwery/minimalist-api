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

const getLaterToday = () => dayjs().endOf('day')
const getTomorrow = () => dayjs().add(1, 'day')
const getNextWeek = () => dayjs().endOf('week').add(2, 'days')
const formatDate = (date: dayjs.ConfigType) => dayjs(date).format('ddd, MMM D')
const isInPast = (date: dayjs.ConfigType) => dayjs().isAfter(dayjs(date))

export const ScheduleMenu: React.FunctionComponent<Props> = ({ due, onSchedule }) => {
  const menu = useMenuState({ placement: 'top', gutter: scale(0.5) })
  const trigger = due ? (
    <MenuButton
      {...menu}
      as={Text}
      size={300}
      marginTop={1}
      color={isInPast(due) ? colors.fill.danger : colors.text.muted}
      cursor="pointer"
    >
      {dayjs(due).calendar(undefined, calendarFormat)}
    </MenuButton>
  ) : (
    <MenuButton {...menu} as={Icon} icon={Calendar} isInteractive color={colors.fill.secondary} />
  )

  const scheduleToday = React.useCallback(() => {
    const due = getLaterToday().toDate()
    onSchedule(due)
    menu.hide()
  }, [onSchedule, menu.hide])

  const scheduleTomorrow = React.useCallback(() => {
    const due = getTomorrow().toDate()
    onSchedule(due)
    menu.hide()
  }, [onSchedule, menu.hide])

  const scheduleNextWeek = React.useCallback(() => {
    // Monday, next week
    const due = getNextWeek().toDate()
    onSchedule(due)
    menu.hide()
  }, [onSchedule, menu.hide])

  const unschedule = React.useCallback(() => {
    onSchedule(null)
    menu.hide()
  }, [onSchedule, menu.hide])

  return (
    <>
      {trigger}
      <Menu {...menu} aria-label="Schedule Menu" width="auto">
        <MenuItem {...menu} onClick={scheduleToday}>
          <Icon icon={Clock} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit" marginRight={scale(3)}>
            Today
          </Text>
          <Text fontSize="inherit" color="muted" marginLeft="auto" whiteSpace="nowrap">
            {formatDate(getLaterToday())}
          </Text>
        </MenuItem>
        <MenuItem {...menu} onClick={scheduleTomorrow}>
          <Icon icon={Sunrise} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit" marginRight={scale(3)}>
            Tomorrow
          </Text>
          <Text fontSize="inherit" color="muted" marginLeft="auto" whiteSpace="nowrap">
            {formatDate(getTomorrow())}
          </Text>
        </MenuItem>
        <MenuItem {...menu} onClick={scheduleNextWeek}>
          <Icon icon={FastForward} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit" marginRight={scale(3)}>
            Next week
          </Text>
          <Text fontSize="inherit" color="muted" marginLeft="auto" whiteSpace="nowrap">
            {formatDate(getNextWeek())}
          </Text>
        </MenuItem>
        <MenuItem {...menu} onClick={unschedule}>
          <Icon icon={Slash} size={scale(2)} color={colors.text.muted} marginRight={scale(1)} />
          <Text fontSize="inherit">No due date</Text>
        </MenuItem>
      </Menu>
    </>
  )
}
