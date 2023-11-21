const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = 4500;

// Connect to the PostgreSQL database
const pool = new Pool({
  host: 'db',
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  port: 5432,
});

// Create the coingecko_data table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS coingecko_data (
    id SERIAL PRIMARY KEY,
    response_headers JSONB,
    response_body JSONB,
    response_code INTEGER,
    user_uid TEXT
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/log', async (req, res) => {
  const { response_headers, response_body, response_code, user_uid } = req.body;

  // Insert the data into the database
  await pool.query(
    'INSERT INTO coingecko_data (response_headers, response_body, response_code, user_uid) VALUES ($1, $2, $3, $4)',
    [response_headers, response_body, response_code, user_uid]
  );

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});