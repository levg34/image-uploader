var app = angular.module('app', [])

app.config(['$httpProvider', function($httpProvider) {
	//initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}

	//disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT'
	// extra
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache'
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache'
}])

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
}])

app.service('alertService', function() {
	var errors = []
	var successes = []

	var addError = function(newObj) {
		errors.push(newObj)
	}

	var getErrors = function(){
		return errors
	}
	
	var addSuccess = function(newObj) {
		successes.push(newObj)
	}

	var getSuccesses = function(){
		return successes
	}

	return {
		addError: addError,
		getErrors: getErrors,
		addSuccess: addSuccess,
		getSuccesses: getSuccesses
	}
})

app.controller('imgListCtrl', function($scope,$http,alertService) {
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
			//$scope.refreshImageList()
			alertService.addSuccess(image+' was deleted successfully.')
		}).catch(function(error) {
			console.log(error)
			alertService.addError('Error deleting '+image+': '+error.data)
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

app.controller('alertCtrl', function($scope,$location,alertService) {
	$scope.errors = alertService.getErrors()
	$scope.successes = alertService.getSuccesses()
	$scope.dispayAlerts = function() {
		var params = $location.search()
		if (params.success) {
			alertService.addSuccess(params.success+' has been uploaded successfully.')
			$location.search('success', null)
		}
	}
	$scope.dispayAlerts()
})