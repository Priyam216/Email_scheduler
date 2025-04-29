const express = require('express');
const router = express.Router();
const emailQueue = require('../queue/emailQueue');
const prisma = require('../lib/prisma');

const chrono = require('chrono-node');

router.post('/', async (req, res) => {
  try {
    const { to, subject, body, sendAt } = req.body;

    if (!to || !subject || !body || !sendAt) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const parsedDate = chrono.parseDate(sendAt);
    if (!parsedDate) {
      return res.status(400).json({ error: 'Invalid date format. Use a valid date/time phrase.' });
    }

    const delay = parsedDate.getTime() - Date.now();
    if (delay < 0) {
      return res.status(400).json({ error: 'Scheduled time must be in the future.' });
    }

    const task = await prisma.emailTask.create({
      data: { to, subject, body, sendAt: parsedDate, status: 'SCHEDULED' }
    });

    await emailQueue.add('sendEmail', {
      taskId: task.id,
      to,
      subject,
      body,
    }, {
      delay,
      attempts: 3,
    });

    res.status(200).json({ message: 'Email scheduled', id: task.id });
  } catch (err) {
    console.error('Error scheduling email:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.emailTask.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Email task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error('Error fetching email task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /admin/emails - Fetch all email tasks
router.get('/admin/emails', async (req, res) => {
  try {
    const tasks = await prisma.emailTask.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (err) {
    console.error('Error fetching all email tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
