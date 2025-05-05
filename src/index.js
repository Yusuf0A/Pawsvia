const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = 5050;

let accessToken = '';
let tokenExpires = 0;

const getAccessToken = async () => {
  if (Date.now() > tokenExpires) {
    const res = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
    });

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpires = Date.now() + data.expires_in * 1000;
  }
  return accessToken;
};

app.get('/api/pets', async (req, res) => {
  const token = await getAccessToken();
  const location = req.query.location || '94110';

  const response = await fetch(`https://api.petfinder.com/v2/animals?location=${location}&limit=10`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  res.json(data);
});

app.get('/api/pets/:id', async (req, res) => {
  const token = await getAccessToken();
  const id = req.params.id;

  const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
