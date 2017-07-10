var app = angular.module('app', [])

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