const express = require("express");
const app = express();

app.use("/",(req,res)=>{
    res.send("helloo from the server!");
})



app.listen("3000", ()=>{
    console.log("connected to server");
})