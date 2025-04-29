const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
    maxRetriesPerRequest: null,
}); 

const emailQueue = new Queue('emailQueue', {
  connection,
});

module.exports = emailQueue;
