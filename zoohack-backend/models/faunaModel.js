var mongoose  = require("mongoose");
var faunaSchema = new mongoose.Schema({
  User_name: String,
  AD_name: String,
  Date: Date,
  Type_1: String,
  Type_2: String,
  Type_3: String,
  Sale_or_no: String,
  Price: Number,
  Keywords: Array
}, {"collection": "fauna"});

faunaSchema.statics.getKeywords = function(tag, callback){
  console.log("inside static function");
  this.find({}).or({ AD_name: new RegExp(tag, "i")})
  .or({ Type_1: new RegExp(tag, "i")})
  .or({ Type_2: new RegExp(tag, "i")})
  .or({ Type_3: new RegExp(tag, "i")})
  .then((data) => {
    callback(data);
  });
};

faunaSchema.statics.findByKeywords = function(tag, keywords, callback){
  console.log("inside static function");
  this.find({}).or({ AD_name: new RegExp(tag, "i")})
  .or({ Type_1: new RegExp(tag, "i")})
  .or({ Type_2: new RegExp(tag, "i")})
  .or({ Type_3: new RegExp(tag, "i")})
  .and({Keywords: {$in: keywords}})
  .then((data) => {
    callback(data);
  });
};

const DB = mongoose.connection.useDb('zoohack');
module.exports = mongoose.model('faunaModel', faunaSchema);