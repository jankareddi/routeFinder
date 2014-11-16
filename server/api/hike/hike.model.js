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
  },
  maprouteRequests : [{ type: Schema.Types.ObjectId, ref: 'Maproute' }],
  maprouteAccepts : [{ type: Schema.Types.ObjectId, ref: 'Maproute' }],
  maprouteRejects : [{ type: Schema.Types.ObjectId, ref: 'Maproute' }]
});

module.exports = mongoose.model('Hike', HikeSchema);