'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HikeSchema = new Schema({
  startPoint : {
    lng : Number,
    lat : Number,
    address : String
  },
  endPoint : {
    lng : Number,
    lat : Number,
    address : String
  }
});

module.exports = mongoose.model('Hike', HikeSchema);