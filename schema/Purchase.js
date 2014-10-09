'use strict';

exports = module.exports = function(app, mongoose) {
  var purchaseSchema = new mongoose.Schema({
  	item : {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
	employee : {type : mongoose.Schema.Types.ObjectId, ref: 'Account'},
	amount : Number,
	purchaseDate : {type : Date, default : Date.now},
	search: [String]
  });
  purchaseSchema.plugin(require('./plugins/pagedFind'));
  purchaseSchema.index({ item: 1 });
  purchaseSchema.index({ employee: 1 });
  purchaseSchema.index({ search: 1 });
  purchaseSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Purchase', purchaseSchema);
};
