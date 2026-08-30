import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, prettyPrint } = format;
const LOG_MAX_SIZE = 5242880;

const infoOnly = format((info) => {
	return info.level === 'info' ? info : false;
});

const errorOnly = format((info) => {
	return info.level === 'error' ? info : false;
});

export const logger = createLogger({
	level: 'info',
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), prettyPrint()),
	transports: [
		new transports.File({
			filename: 'logs/info.log',
			format: combine(infoOnly(), prettyPrint()),
			maxsize: LOG_MAX_SIZE,
		}),
		new transports.File({
			filename: 'logs/error.log',
			format: combine(errorOnly(), prettyPrint()),
			maxsize: LOG_MAX_SIZE,
		}),
	],
});

export default logger;
