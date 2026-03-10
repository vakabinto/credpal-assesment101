const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Status
app.get('/status', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.status(200).json({ status: 'UP', db: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', db: 'Disconnected' });
  }
});

// Process POST (dummy: store data in DB)
app.post('/process', async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).send('Missing data');
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO processed (data) VALUES ($1)', [data]);
    client.release();
    res.status(200).json({ message: 'Processed', data });
  } catch (err) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Initialize DB table on startup (for demo)
(async () => {
  const client = await pool.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS processed (
      id SERIAL PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  client.release();
})();