'use strict';

var express = require('express');
var controller = require('./hike.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.put('/:id/matches', controller.addMatch);
router.delete('/:id/:collectionType/:routeId', controller.removeRouteFromHike);
router.put('/:id/:collectionType', controller.setRouteOnHike);

module.exports = router;