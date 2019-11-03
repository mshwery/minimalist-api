import { noop } from 'lodash'

// @ts-ignore
const analytics = window.analytics || {
  track: noop,
  identify: noop,
  page: noop
}

export default analytics
