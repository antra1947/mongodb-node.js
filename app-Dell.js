const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
require('dotenv').config();
const app=express();
const port=3000;
app.use(express.json()); //middleware- for parsing the data in the server side
app.use(express.static(path.join(__dirname,'public'))); 
const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL)
// mongoose.connect('mongodb+srv://antra1947:antra04@cluster0.57wemrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log('connected to MongoDB'))
.catch(err=>console.error('error connecting to mongoDb:',err));
const useerSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
const User=mongoose.model('User',useerSchema);
app.get('/users',(req,res)=>{
    User.find({})
    .then(users=>res.json(users))
    .catch(err => res.status(500).json({
        message:err.message
    }));
});
app.post('/users',(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    user.save()
    .then(newUser =>res.status(201).json(newUser))
    .catch(err=>res.status(400).json({message:err.message}));
});

app.put('/users/:id',(req,res)=>{
    const userId=req.params.id;
    const updateData={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    };
    User.findByIdAndUpdate(userId, updateData,{new:true})
    .then(updatedUser =>{
        if(!updatedUser){
            return res.status(404).json({message:'User not found'});
        }
        res.json(updatedUser);
    })
    .catch(err=>res.status(400).json({message:err.message}));
});
app.delete('/users/:id',(req,res)=>{
    const userId=req.params.id;
    User.findByIdAndDelete(userId)
    .then(deletedUser =>{
        if(!deletedUser){
            return res.status(404).json({message:'user not found'});
        }
        res.json({message:"User deleted succefully"});
    })
    .catch(err=>res.status(400).json({message:err.message}));
    
    
});
app.listen(port,()=>{
    console.log(`It is running on port ${port}`);
})