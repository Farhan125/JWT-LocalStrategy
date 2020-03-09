if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}


const express=require('express');
const jwt =require('jsonwebtoken');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const passport=require('passport');
const flash=require('express-flash');
const session=require('express-session')
const app=express();

const initializePassport=require('./config/passport');
initializePassport(passport,
    email=>user.find(user=>user.email==email),
    id=>user.find(user=>user.id==id)
    );

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view-engine','ejs');


// app.post('/api/post', verifyToken, (req, res) => {
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             res.json({message: 'Post created',authData})
//         }
//     })

// })

const user=[];
app.use(passport.initialize());
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}));
app.use(passport.session());

app.get('/homepage', (req, res) => {
    res.render('index.ejs');
    jwt.sign({user},'secretkey',(err,token)=>{
        //res.json({token})
        console.log('Token: ');
        console.log(token);
        });
     })
   
      app.post('/logout',verifyToken,(req,res)=>{
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.json({message: 'Loged out',authData})
            }
        })
      })

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/homepage',
    failureRedirect:'/login',
    failureFlash: true}))
    
        
            
function verifyToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];
    if (typeof tokenHeader != 'undefined') {
        const payload = tokenHeader.split(' ');
        const payloadToken = payload[1];
        req.token = payloadToken;
        next();

    } else {
        res.sendStatus(403);
    }

}
// app.post('/login',(req,res)=>{
//         //  const user={
//         //      id:1,
//         //      Name: 'ABC',
//         //      Age: '123'
//         //  }

//         // const user=req.body;
//         // jwt.sign({user},'secretkey',(err,token)=>{
//         // res.json({token})
//         // });
// console.log("loged inn....");
//      })
// function verifyToken(req,res,next){
// const tokenHeader=req.headers['authorization'];
// if(typeof tokenHeader !='undefined'){
//     const payload=tokenHeader.split(' ');
//     const payloadToken=payload[1];
//     req.token=payloadToken;
//     next();

// }else{
//     res.sendStatus(403);
// }
// }



app.get('/register', (req, res) => {
    res.render('register.ejs');
})
app.post('/register', async(req, res) => {
try{
const hashpassword=await bcrypt.hash(req.body.password,10);
user.push({
    id:Date.now().toString(),
    name: req.body.name,
    email:req.body.email,
    password: hashpassword
})
res.redirect('/login');
}catch{
res.redirect('/register')
}
    console.log(user);
})

app.listen(5000,()=>console.log('listening on port 5000'))