const debug = require("debug")("evolvus-supportedDateFormats:db:supportedDateFormats");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;
const _ = require("lodash");

const schema = require("./supportedDateFormatsSchema");

// Creates a supportedDateFormatsCollection collection in the database
var collection = mongoose.model("supportedDateFormats", schema);

// Saves the supportedDateFormats object to the database and returns a Promise
// The assumption here is that the Object is valid
// tenantId must match object.tenantId,if missing it will get added here
module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });
  let saveObject = new collection(result);
  return saveObject.save();
};


// Returns a limited set if all the supportedDateFormats(s) with a Promise
// if the collectiom has no records it Returns
// a promise with a result of  empty object i.e. {}
// limit = 0 returns all the values in the query
// else returns absolute value of limit i.e. -5 or 5 returns 5 rows
// orderby has the format { field: 1 } for ascending order and { field: -1 }
// for descending e.g. { "createdDate": 1} or { "supportedDateFormatsCode" : -1 }
// any number other than 1 and -1 throws an error;
// skip can be 0 or more, it cannot be negative
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });

  return collection.find(query)
    .sort(orderby)
    .skip(skipCount)
    .limit(limit);
};

// Finds the supportedDateFormats which matches the value parameter from supportedDateFormats collection
// If there is no object matching the attribute/value, return empty object i.e. {}
// null, undefined should be rejected with Invalid Argument Error
// Should return a Promise
module.exports.findOne = (tenantId, filter) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.findOne(query);
};

//
// Finds the supportedDateFormats for the id parameter from the supportedDateFormats collection
// If there is no object matching the id, return empty object i.e. {}
// null, undefined, invalid objects should be rejected with Invalid Argument Error
// All returns are wrapped in a Promise
//
module.exports.findById = (tenantId, id) => {
  let query = {
    "tenantId": tenantId,
    "_id": new ObjectId(id)
  };
  return collection.findOne(query);
};

//Finds one supportedDateFormats by its code and updates it with new values
// Using the unique key i.e. tenantId/supportedDateFormatsCode
module.exports.update = (tenantId, code, update) => {
  let query = {
    "tenantId": tenantId,
    "formatCode": code
  };
  return collection.update(query, update);
};


module.exports.counts = (tenantId, filter) => {
  let query = _.merge(filter, {
    "tenantId": tenantId,

  });
  console.log("QUERY OF COUNTS", query);
  return collection.count(query);
};
// Deletes all the entries of the collection.
// To be used by test only
module.exports.deleteAll = (tenantId) => {
  let query = {
    "tenantId": tenantId
  };
  return collection.remove(query);
};