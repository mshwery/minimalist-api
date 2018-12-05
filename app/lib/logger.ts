import winston from 'winston'
import config from '../../config'

const logger = winston.createLogger({
  levels: winston.config.syslog.levels
})

// Output human readable logs in development
if (config.get('NODE_ENV') === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

export default logger
