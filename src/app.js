const express = require("express");
const app = express();

// app.use('/user',(req,res)=>{
//     res.send("HAHHAHAHAHAH");
// })

app.get("/user",(req,res)=>{
    res.send({firstname:"Akshay",lastName:"Saini"});
})

app.post("/user",(req,res)=>{
    res.send("DATA SAVED TO DATA BASE");
})

app.patch("/user",(req,res)=>{
    res.send("edit madtaa ediini");
})

app.delete("/user",(req,res)=>{
    res.send("deleted user successfully");
})



app.listen("8080", ()=>{
    console.log("connected to server");
})