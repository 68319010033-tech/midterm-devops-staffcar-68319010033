require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/db');

const app = express();
app.use(cors());
app.use(express.json());

// ตาราง cars (staffcar) — สร้างอัตโนมัติถ้ายังไม่มี
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cars (
      id SERIAL PRIMARY KEY,
      plate_no VARCHAR(20) NOT NULL,
      type VARCHAR(20) NOT NULL,
      brand_model VARCHAR(100),
      color VARCHAR(50),
      owner VARCHAR(100),
      department VARCHAR(100),
      status VARCHAR(20) DEFAULT 'รอออก'
    )
  `);
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// GET all
app.get('/api/cars', async (req, res) => {
  const result = await pool.query('SELECT * FROM cars ORDER BY id');
  res.json(result.rows);
});

// GET by id
app.get('/api/cars/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// POST
app.post('/api/cars', async (req, res) => {
  const { plate_no, type, brand_model, color, owner, department, status } = req.body;
  const result = await pool.query(
    `INSERT INTO cars (plate_no, type, brand_model, color, owner, department, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [plate_no, type, brand_model, color, owner, department, status || 'รอออก']
  );
  res.status(201).json(result.rows[0]);
});

// PUT
app.put('/api/cars/:id', async (req, res) => {
  const { plate_no, type, brand_model, color, owner, department, status } = req.body;
  const result = await pool.query(
    `UPDATE cars SET plate_no=$1, type=$2, brand_model=$3, color=$4,
     owner=$5, department=$6, status=$7 WHERE id=$8 RETURNING *`,
    [plate_no, type, brand_model, color, owner, department, status, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// DELETE
app.delete('/api/cars/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM cars WHERE id=$1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  initDb().then(() => {
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  });
}

module.exports = app;