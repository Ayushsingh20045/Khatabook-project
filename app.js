const express=require('express');
const app=express();
const fs=require('fs');
const path = require('path');

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    fs.readdir('./files',function(err,files){
        if(err) throw err
      else res.render("index",{files})
    })
})

app.get('/create',(req,res)=>{
    res.render('create');
})

app.post('/writefile',(req,res)=>{
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
    const year = currentDate.getFullYear();
    const fn = `${day}-${month}-${year}.txt`;

    fs.writeFile(`./files/${fn}`,req.body.filedata||'',function(err){
        if(err){
            console.error("File Write Error:",err);
            return res.send("Something went wrong while creating the file.")
        }
        else res.redirect('/')
    })
   
})



app.listen(3000);