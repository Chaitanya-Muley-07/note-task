const express= require('express');
const app=express();
const path = require('path');
const fs= require('fs');
const { log } = require('console');


//parsers to get form data from frontend
//ejs is html only but with special power 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.get("/",function(req,res)
{
    fs.readdir(`./files`,function(err,files)
    {  
       //here we have sent files in form of obj(which is array here) whose name is files 
        res.render("index",{files:files});
    })
    
})

// for editing filename
app.get("/edit/:filename",function(req,res)
{
    res.render('edit',{filename:req.params.filename});
})

//after editing,to post the changes for editing filename
app.post("/edit/",function(req,res)
{
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        if (err) {
            console.log("Error renaming file:", err);
        } else {
            console.log("File renamed successfully!");
            res.redirect("/");
        }
    });
})

//for getting each note
app.get("/file/:filename",function(req,res)
{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata)
    {  
     res.render('show',{filename:req.params.filename ,filedata:filedata});
    })
})

//creating a note(here the resposes from frontend are being taken)
app.post("/create",function(req,res)
{
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err)
{
   res.redirect("/");
})
})
app.listen(3000);