const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emailRoutes = require('./routes/email');
require('./jobs/emailProcessor'); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/email', emailRoutes);

app.get('/', (req, res) => {
  res.send('Email Scheduler API is running ✅');
});

const PORT = process.env.PORT || 3000;

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
