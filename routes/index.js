var express = require('express');
const passport = require('passport');
const userModel = require('./users')
var router = express.Router();
const NotesModel = require('./Notes')
const localStrategy = require("passport-local");
const upload = require('./multer');



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
    res.redirect('/Profile')

    })

    // registration route  
    router.post('/register', async function(req, res) {
      try {
          const existingUser = await userModel.findOne({ username: req.body.username });
          if (existingUser) {
              return res.status(400).send("This username already exists");
          }
          
          const userData = new userModel({
              username: req.body.username,
              Name: req.body.name,
              email: req.body.email
          });
          
          const registeredUser = await userModel.register(userData, req.body.password);
          passport.authenticate('local')(req, res, () => {
              res.redirect('/profile');
          });
      } catch (error) {
          console.error(error);
          res.status(500).send("An error occurred");
      }
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
  res.render('Home');
});
router.get('/Loginpage', function(req, res, next) {
  res.render('Loginform');
});

router.get('/editprofile',async function(req, res, next) {
  const Useragya= await userModel.findOne({username:req.session.passport.user });
  res.render('profileEdit',{User:Useragya});
});
router.get('/signupForm', function(req, res, next) {
  res.render('Signup');
});


router.get('/edit/:id',isLogIn, async function(req, res, next) {
  const id = req.params.id;

  let editNote= await NotesModel.findById({_id:id})


      res.render('Edit', { note: editNote });
  });
router.get('/delete/:id',isLogIn, async function(req, res, next) {
  const id = req.params.id;

  await NotesModel.findByIdAndDelete({_id:id})
  res.redirect('/post')
      
  });

router.post("/update",isLogIn,async function(req, res){
    await NotesModel.updateOne({_id: req.body.Id},
      {
        title: req.body.Title,
      Discription:req.body.Discription
    }
    );
    res.redirect('/Profile')
})
router.post("/updateprofiles",isLogIn,upload.single("image"),async function(req, res){
  const username = req.session.passport.user;
    const bio = req.body.Bio;
    const Name = req.body.name; 
    let image;

    if (req.file) {
        image = req.file.filename;
    } else {
        const user = await userModel.findOne({ username });
        image = user.Image;
    }

    const profileUpdate = await userModel.findOneAndUpdate(
        { username },
        { $set: { Name, bio, Image: image }},
        { new: true }
    );
    res.redirect('/profile')
});

router.get('/Post', isLogIn, async function(req, res, next) {

  res.render('Post');
});
router.get('/profile', isLogIn,async function(req, res, next) {
  const user= await userModel.findOne({username:req.session.passport.user });
  const notesAll = await NotesModel.find({userName:user._id}).populate("userName")
  const whichone= "All Notes"     

  res.render('Profile',{user,notesAll,whichone});


});
router.get('/profile/thisweek',isLogIn, async function(req, res, next) {
  const user= await userModel.findOne({username:req.session.passport.user });
  const whichone= "This Week Notes"
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const  notesAll= await NotesModel.find({
          userName: user._id,
          Date: { $gte: oneWeekAgo, $lte: currentDate }
      }).populate("userName");
  res.render('Profile',{user,notesAll,whichone});
})
router.get('/profile/today',isLogIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const whichone= "Today Notes"
  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const notesAll = await NotesModel.find({
      userName: user._id,
      Date: { $gte: startOfDay, $lte: endOfDay }
  }).populate("userName");
  res.render('Profile',{user,notesAll,whichone});

})
router.get('/profile/thismonth',isLogIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const whichone= "This Month Notes"     
  const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const notesAll = await NotesModel.find({
            userName: user._id,
            Date: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate("userName");
        res.render('Profile',{user,notesAll,whichone});
})

module.exports = router;
