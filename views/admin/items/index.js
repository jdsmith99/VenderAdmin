'use strict';

exports.find = function(req, res, next){
  console.log("finding");

  req.query.name = req.query.name ? req.query.name : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';


  var filters = {};
  if (req.query.name) {
    filters.name = new RegExp('^.*?'+ req.query.name +'.*$', 'i');
  }

  req.app.db.models.Item.pagedFind({
    filters: filters,
    keys: 'name description purchases active',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      results.filters = req.query;
      res.send(results);
    }
    else {

      results.filters = req.query;
      res.render('admin/items/index', { data: { results: escape(JSON.stringify(results)) } });
      //console.log("results: " + JSON.stringify(results));
      
    }
  });
};

exports.read = function(req, res, next){
  req.app.db.models.Item.findById(req.params.id).exec(function(err, item) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(item);
    }
    else {
      //req.app.db.models.Purchase.count({ "item" : req.params.id }).exec(function (err, count) {
      res.render('admin/items/details', { data: { record: escape(JSON.stringify(item)) } });
      //res.render('admin/items/details', { data: { record: escape(JSON.stringify(newObject)) } });
    }
  });
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not create items.');
      return workflow.emit('response');
    }

    if (!req.body.name) {
      workflow.outcome.errors.push('A name is required.');
      return workflow.emit('response');
    }

    workflow.on('duplicateItemCheck', function() {

    });

    req.app.db.models.Item.findOne( { name : req.body.name }).exec(function(err, item) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (item) {
        workflow.outcome.errors.push('That name is already taken.');
        return workflow.emit('response');
      }

      workflow.emit('createItem');
    });
  });


  workflow.on('createItem', function() {
    var fieldsToSet = {
      name: req.body.name
    };

    req.app.db.models.Item.create(fieldsToSet, function(err, item) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = item;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not update items.');
      return workflow.emit('response');
    }

    if (!req.body.name) {
      workflow.outcome.errfor.name = 'required';
      return workflow.emit('response');
    }

    workflow.emit('patchItem');
  });

  workflow.on('patchItem', function() {

    // establish order for each Item; vending machine specific
    var itemCode = req.body.code;
    var orderFirstDigit = itemCode.substr(0, 1);
    var orderReverseString = itemCode.split("").reverse().join("");  
    var orderSecondDigit = orderReverseString.substr(0, 1);
    var orderSecondNumber = 10 - parseInt(orderSecondDigit);
    var orderString = orderFirstDigit + orderSecondNumber.toString();
    console.log("ordering: " + orderString);

    var orderNumber = parseInt(orderString);

    var fieldsToSet = {
      name: req.body.name,
      description: req.body.description,
      code: req.body.code,
      cost: req.body.cost,
      active: req.body.active,
      imageUri: req.body.imageUri,
      order: orderNumber
    };

    req.app.db.models.Item.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, item) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.item = item;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete items.');
      return workflow.emit('response');
    }

    workflow.emit('deleteItem');
  });

  workflow.on('deleteItem', function(err) {
    req.app.db.models.Item.findByIdAndRemove(req.params.id, function(err, item) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
