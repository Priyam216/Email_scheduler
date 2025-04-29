const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const prisma = require('../lib/prisma');
const nodemailer = require('nodemailer');

const connection = new IORedis({
  maxRetriesPerRequest: null,
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});
// Create email transporter
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// Worker to process email jobs
const worker = new Worker('emailQueue', async job => {
  const { taskId, to, subject, body } = job.data;

  try {
    // Send email
    await transporter.sendMail({
      from: '"Email Scheduler" <noreply@example.com>',
      to,
      subject,
      text: body,
    });

    // Update task status to SENT
    await prisma.emailTask.update({
      where: { id: taskId },
      data: { status: 'SENT' }
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}`, err);

    // Mark as FAILED if retries are exhausted
    if (job.attemptsMade + 1 >= job.opts.attempts) {
      await prisma.emailTask.update({
        where: { id: taskId },
        data: { status: 'FAILED' }
      });
      console.log(` Marked task ${taskId} as failed after retries`);
    }

    throw err; 
  }
}, { connection });

module.exports = worker;
