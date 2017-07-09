var app = angular.module('app', [])

app.controller('testCtrl', function($scope,$http) {
	$scope.images = []
	$http({
		method: 'GET',
		url: '/images'
	}).then(function(images) {
		$scope.images = images.data
	}).catch(function(errRes) {
		// Handle errRess
	})
})
