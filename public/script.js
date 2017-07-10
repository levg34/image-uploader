var app = angular.module('app', [])

app.config(['$httpProvider', function($httpProvider) {
	//initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}

	// Answer edited to include suggestions from comments
	// because previous version of code introduced browser-related errors

	//disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT'
	// extra
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache'
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache'
}])

app.controller('testCtrl', function($scope,$http) {
	$scope.images = []
	$scope.copyURL = function() {
		$('#url').focus()
		$('#url').select()
		document.execCommand('copy')
	}
	$scope.viewImage = function(image) {
		window.location = '/view/'+image
	}
	$scope.deleteImage = function(image) {
		$http({
			url: '/delete/'+image,
			method: 'DELETE'
		}).then(function(result) {
			$scope.refreshImageList()
		}).catch(function(error) {
			console.log(error)
			$('#errors').text(error.responseText)
		})
	}
	$scope.refreshImageList = function() {
		$http({
			method: 'GET',
			url: '/images'
		}).then(function(images) {
			$scope.images = images.data
		}).catch(function(error) {
			console.log(error)
		})
	}
	$scope.refreshImageList()
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