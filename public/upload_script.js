var dropzone = $('#dropzone')
var file = $('#file')
var token = ''
if (location.search.split('=').length > 1) {
	token = location.search.split('=')[1]
}
var nickname = location.pathname.split('/')[location.pathname.split('/').length-1]

function sendUrl(url) {
	$.ajax({
		url: 'http://nodechat-levg34.rhcloud.com/emit',
		//url: 'http://localhost:8080/emit',
		type: 'post',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			nickname:nickname,
			event:'send_url',
			params:url
		}),
		headers: {
			'X-Auth-Token': token
		},
		dataType: 'json',
		processData: false,
		success: function (data) {
			console.info(data);
		}
	})
}

sendUrl('http://afelectrical.com.au/wp-content/uploads/2014/03/Tested-ok.jpg')

dropzone.on('dragover', function(e) {
	e.preventDefault()
	dropzone.addClass('hover')
	dropzone.text('yup, in here!')
	return false
})
 
dropzone.on('dragleave', function(e) {
	e.preventDefault()
	dropzone.removeClass('hover')
	dropzone.text('')
	return false
})
 
dropzone.on('drop', function(e) {
	// prevent browser from open the file when drop off
	e.stopPropagation()
	e.preventDefault()
	dropzone.removeClass('hover')
 
	// retrieve uploaded files data
	var files = e.originalEvent.dataTransfer.files
	processFiles(files)
 
	return false
})

function processFiles(files) {
	console.log(files)
	dropzone.empty()
	dropzone.html(files[0].name+' has been uploaded.<br>Last modified: '+files[0].lastModifiedDate)
	
	var reader = new FileReader()

	reader.onload = function(e2) {
		// finished reading file data.
		dropzone.append('<img src="'+e2.target.result+'">')
	}

	reader.readAsDataURL(files[0])
	
}
