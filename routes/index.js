var express = require('express');
const passport = require('passport');
const userModel = require('./users')
var router = express.Router();
const NotesModel = require('./Notes')
const localStrategy = require("passport-local");



passport.use(new localStrategy(userModel.authenticate()))

// for creating Data  

router.post('/create',isLogIn, async function(req,res){
  const user= await userModel.findOne({username:req.session.passport.user});
  var userNotes=await NotesModel.create({
    userName: user._id,
    title: req.body.Title,
    Discription:req.body.Discription
    })
    user.NoteList.push(userNotes)
    await user.save()
    res.redirect('/post')

    })

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
router.get('/Post', isLogIn, async function(req, res, next) {
  const user= await userModel.findOne({username:req.session.passport.user });
  const notesAll = await NotesModel.find().populate("userName")
  res.render('Posting',{name: `${user.username}`,notesAll});
});
router.get('/profile', isLogIn,async function(req, res, next) {

  const user= await userModel.findOne({username:req.session.passport.user });

  res.render('MainApp', { title: 'profile' ,user});

});

module.exports = router;
