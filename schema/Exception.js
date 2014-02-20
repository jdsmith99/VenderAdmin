var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var ExceptionSchema = new Schema({
	description : String,
	date : {type : Date, default : Date.now}, 
	source : Object,
	error: Object
});

module.exports = mongoose.model("Exception", ExceptionSchema);