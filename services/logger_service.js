/* eslint-disable indent */
const pino = require('pino');
const path = require('node:path');
const logger = pino(
	{
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'yyyy-dd-mm, h:MM:ss TT',
                destination: (path.resolve('./logs/logger.log')),
            },
        },
    },
);
module.exports = logger;