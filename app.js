const express = require('express');
require('dotenv').config();
const router_home = require('./routes/router_home')
const router_auth = require('./routes/router_auth')


const app = express();
const port = process.env.PORT;

//View engine
app.set('view engine', 'pug');
app.set('views','./views');

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/', router_home);
app.use('/auth', router_auth);

// 404
app.get('*',  (req, res) => {
    res.status(404).send('404')
  });

app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});