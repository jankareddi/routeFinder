'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MaprouteSchema = new Schema({
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
  overview_polyline: String,
  loc : {
    type : {type : String},
    coordinates : []
  }
});

MaprouteSchema.index({loc : '2dsphere'});
module.exports = mongoose.model('Maproute', MaprouteSchema);