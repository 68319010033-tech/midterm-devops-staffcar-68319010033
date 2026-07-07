const pool = require('../db');

const getAllCars = async (req, res) => {
  try {
    const { status = '', department = '' } = req.query;
    const params = [];
    let where = 'WHERE 1=1';
    if (status) { params.push(status); where += ` AND status = $${params.length}`; }
    if (department) { params.push(department); where += ` AND department = $${params.length}`; }

    const { rows } = await pool.query(
      `SELECT * FROM cars ${where} ORDER BY id DESC`, params
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getCarById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบข้อมูลรถนี้' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const createCar = async (req, res) => {
  try {
    const { plate_no, type, brand_model = '', color = '', owner = '', department = '', status = 'รอออก' } = req.body;
    if (!plate_no) return res.status(400).json({ error: 'กรุณาระบุทะเบียนรถ' });

    const { rows } = await pool.query(
      `INSERT INTO cars (plate_no, type, brand_model, color, owner, department, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [plate_no, type, brand_model, color, owner, department, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateCar = async (req, res) => {
  try {
    const { plate_no, type, brand_model, color, owner, department, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE cars SET plate_no=$1, type=$2, brand_model=$3, color=$4,
       owner=$5, department=$6, status=$7 WHERE id=$8 RETURNING *`,
      [plate_no, type, brand_model, color, owner, department, status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบข้อมูลรถนี้' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteCar = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM cars WHERE id=$1 RETURNING *', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบข้อมูลรถนี้' });
    res.json({ message: 'ลบข้อมูลสำเร็จ', deleted: rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar };