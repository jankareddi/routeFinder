'use strict';

var express = require('express');
var controller = require('./hike.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.put('/:id/matches', auth.isAuthenticated(), controller.addMatch);
router.delete('/:id/:collectionType/:routeId', auth.isAuthenticated(), controller.removeRouteFromHike);
router.put('/:id/:collectionType', auth.isAuthenticated(), controller.setRouteOnHike);

module.exports = router;