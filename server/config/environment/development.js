'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri:    'mongodb://' + process.env.RFDB_PORT_27017_TCP_ADDR + ':' process.env.RFDB_PORT_27017_TCP_PORT + '/routefinder-dev' ||
            'mongodb://localhost/routefinder-dev'
  },

  seedDB: false
};
