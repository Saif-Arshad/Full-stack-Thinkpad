var express = require('express');
const passport = require('passport');
const userModel = require('./users')
var router = express.Router();
const ListNotes= require('./Listmodel')
const localStrategy = require("passport-local");



passport.use(new localStrategy(userModel.authenticate()))

    // registration route  
    router.post('/register',function(req,res){
      var userdata= new userModel({
        username: req.body.username
      })
    
      userModel.register(userdata, req.body.password)
      .then(function(registereduser){
        passport.authenticate('local')(req,res,()=>{
          res.redirect('/profile')
        })
      })
    
    })


// login  route  

router.post("/login",passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res){})

// logout function 


router.get('/logout',(req,res,next)=>{
  req.logOut(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/')

  })
})


//is login function
function isLogIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/")
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Login');
});
router.get('/profile', isLogIn, function(req, res, next) {
  // const username = req.user.username ;
  // const username = req.user._id;
  // ListNotes.create({
  //   userId: username,
  // })
  res.render('MainApp', { title: 'profile', name:username});

});

module.exports = router;
