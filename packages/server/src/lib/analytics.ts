import Analytics from 'analytics-node'
import config from '../../config'
import { noop } from 'lodash'

const writeKey = config.get('MINIMALIST_API_ANALYTICS_WRITEKEY')

let analytics: Analytics
if (!writeKey || config.get('NODE_ENV') === 'test') {
  analytics = {
    identify: noop,
    track: noop,
  } as Analytics
} else {
  analytics = new Analytics(writeKey)
}

export default analytics
