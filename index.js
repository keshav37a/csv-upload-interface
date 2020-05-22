const express = require('express')
const port = 8000;
const app = new express();
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(express.static('./assets'));

app.use('/', require('./routes/index'));

app.listen(port, (err)=>{
    if(err){
        console.log(`error: ${err}`);
        return;
    }

    console.log(`app up and running on port ${port}`);
})