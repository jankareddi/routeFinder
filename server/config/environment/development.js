'use strict';

var _ = require('lodash');

// Development specific configuration
// ==================================

function getDockerUri() {
  var dockerUri;
  if (!(_.isUndefined(process.env.RFDB_PORT_27017_TCP_ADDR) || _.isUndefined(RFDB_PORT_27017_TCP_PORT)))
    dockerUri = 'mongodb://' + process.env.RFDB_PORT_27017_TCP_ADDR + ':' + process.env.RFDB_PORT_27017_TCP_PORT + '/routefinder-dev';

  return dockerUri;
}

module.exports = {
  // MongoDB connection options
  mongo: {
    uri:    getDockerUri() ||
            'mongodb://localhost/routefinder-dev'
  },

  seedDB: false
};
