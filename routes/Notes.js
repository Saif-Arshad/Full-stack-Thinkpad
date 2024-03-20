const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  userName:{
   type: mongoose.Schema.Types.ObjectId,
   ref: "Users" 
  },
  title:String,
  Discription:String,
  Date: {
    type: Date,
    default: Date.now 
  }
})
module.exports=mongoose.model("Notes",UserSchema)
