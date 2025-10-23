const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPaid: {type:Boolean, default:false},
  price: {type:Number, default:0}
},{timestamps:true});
module.exports = mongoose.model('Note', noteSchema);
