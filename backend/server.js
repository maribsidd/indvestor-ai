const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from Live Server (port 5500) and localhost
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.use('/api/chat', require('./routes/chat'));
app.use('/api/radar', require('./routes/radar'));
app.use('/api/patterns', require('./routes/patterns'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  IndVestor AI running on http://localhost:${PORT}\n`);
});
