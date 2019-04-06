import winston from 'winston'

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.json(),
  transports: [
    // Output human readable logs directly to stdout
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default logger
