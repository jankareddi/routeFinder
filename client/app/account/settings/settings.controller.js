'use strict';

angular.module('routeFinderApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.tolerance = Auth.getCurrentUser().tolerance;

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};

    $scope.changeSettings = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        User.changeSettings( { id: Auth.getCurrentUser()._id }, $scope.tolerance ).$promise
        .then( function() {
          $scope.message = 'Settings successfully changed.';
        })
        .catch( function() {
          form.toleranceDistance.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect tolerance';
          $scope.message = '';
        });
      }
    };
  });
