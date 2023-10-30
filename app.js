const express=require('express');
const bodyParser=require('body-parser');


const blogRoutes=require('./routes/blogRoutes');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());




app.use('/api',blogRoutes);


app.listen(8000,()=>
    {
        console.log('listening');
    });