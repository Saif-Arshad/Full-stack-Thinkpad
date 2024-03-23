const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect("mongodb:https://thinkpad-note.vercel.app/NoteApp")

const UserSchema = mongoose.Schema({
  username:String,
  Name:String,
  password:String,
  email:String,
  Image:String,
  NoteList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Notes"
  }],
  bio:String,

})
UserSchema.plugin(plm)
module.exports=mongoose.model("Users",UserSchema)
