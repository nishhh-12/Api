const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');




const app = express();
app.use(cors());
const port = 3000;

// PostgreSQL configuration
const pool = new Pool({
    host: "192.168.1.50",
    user: "postgres",
    port: 5433,
    password: "admin",
    database: "postgres"
});

app.use(bodyParser.json());


// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

// Define the "GETData" endpoint
app.get('/GETData', async (req, res) => {
  try {
    const query = 'SELECT * FROM status_update';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Define the "UpdateData" endpoint
app.post('/UpdateData', async (req, res) => {
  try {
    const { value } = req.body;
    if (value !== true && value !== false) {
      return res.status(400).json({ error: 'Invalid value' });
    }

    const updateQuery = "UPDATE status_update SET user_status = $1 ";
    const values = [value];

    await pool.query(updateQuery, values);

    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
