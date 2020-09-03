require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
const passport = require('passport');


// app.use(cors())

app.get('/', (req, res) => {
  res.send('Backend home route');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});