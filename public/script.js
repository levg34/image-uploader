var app = angular.module('app', [])

app.controller('testCtrl', function($scope,$http) {
	$scope.images = []
	$scope.copyURL = function() {
		// TODO
	}
	$scope.viewImage = function(image) {
		window.location = '/success/'+image
	}
	$scope.deleteImage = function(image) {
		// TODO
	}
	$http({
		method: 'GET',
		url: '/images'
	}).then(function(images) {
		$scope.images = images.data
	}).catch(function(errRes) {
		// Handle errRess
	})
})
