const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/NoteApp")

const UserSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String,
  NoteList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Notes"
  }],
  bio:String,

})
UserSchema.plugin(plm)
module.exports=mongoose.model("Users",UserSchema)
