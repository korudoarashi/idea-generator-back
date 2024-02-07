import winston from 'winston';

const prefixFolder = process.env.NODE_ENV === 'test' ? 'tests' : '';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: `logs/${prefixFolder}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `logs/${prefixFolder}/combined.log` }),
  ],
});

if(process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
