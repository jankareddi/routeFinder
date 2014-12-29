'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MaprouteSchema = new Schema({
  user : { type: Schema.Types.ObjectId, ref: 'User' },
  startTime : Date,
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
  waypoints: {type: String, default: ''},
  overview_polyline: String,
  loc : {
    type : {type : String},
    coordinates : []
  }
});

/* Virtuals */
MaprouteSchema
  .virtual('userId')
  .get(function() {
    return this.user.toString();
  });

MaprouteSchema.index({loc : '2dsphere'});
module.exports = mongoose.model('Maproute', MaprouteSchema);