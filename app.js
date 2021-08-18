const express = require('express');
require('dotenv').config();


const app = express();
const port = process.env.PORT;

// Routes
app.use('/', (req, res) => {
    res.status(200).send('home');
});

// 404
app.get('*',  (req, res) => {
    res.status(404).send('404')
  });

app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});