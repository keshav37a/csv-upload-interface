const express = require('express')
const port = 8000;
const app = new express();

app.use('/', require('./routes/index'));

app.listen(port, (err)=>{
    if(err){
        console.log(`error: ${err}`);
        return;
    }

    console.log(`app up and running on port ${port}`);
})