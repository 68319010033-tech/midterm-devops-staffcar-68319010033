const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'staffcar API', timestamp: new Date() });
});

app.use('/api/cars', carRoutes);

module.exports = app;