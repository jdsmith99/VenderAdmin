'use strict';

exports = module.exports = function(app, mongoose) {
  var itemSchema = new mongoose.Schema({
  	name: { type: String, default: '' },
    description: { type: String, default: '' },
    code: {type: String, default: '' },
    cost: { type: Number, default: 1 },
    active: { type: String, default: 'no' },
    imageUri: { type: String, default: '' },
    weight: { type: Number },
    calories: { type: Number },
    glutenFree : {type: Boolean },
    lowSugar : { type: Boolean },
    nutFree : { type: Boolean },
    highFiber : { type: Boolean },
    organic : { type: Boolean },
    kosher : { type: Boolean },
    vegan : { type: Boolean },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    order : { type: Number},
    //purchases : [{ type: Schema.Types.ObjectId, ref: 'Purchase'}],
    //exceptions : [{type : Schema.Types.ObjectId, ref: 'Exception'}],
    search: [String]
  });
  itemSchema.plugin(require('./plugins/pagedFind'));
  itemSchema.index({ code: 1 });
  itemSchema.index({ name: 1 });
  itemSchema.index({ search: 1 });
  itemSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Item', itemSchema);
};
