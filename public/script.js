var app = angular.module('app', [])

app.controller('testCtrl', function($scope,$http) {
	$scope.images = []
	$scope.copyURL = function() {
		$('#url').focus()
		$('#url').select()
		document.execCommand('copy')
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

app.directive('imageUrl', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.copyURL = function() {
				$(element).focus()
				$(element).select()
				document.execCommand('copy')
			}
		}
	}
})