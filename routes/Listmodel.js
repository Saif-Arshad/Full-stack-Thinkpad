const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/NoteApp")

const NoteSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'},
    title:String,
    Discription:String,
    Date: {
      type: Date,
      default: Date.now 
    }
  })
  
  module.exports =mongoose.model("NoteList",NoteSchema)
