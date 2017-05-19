var server_port = process.env.OPENSHIFT_NODEJS_PORT || 9000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var express = require('express')
var app = express()
var server = require('http').createServer(app)
var formidable = require('formidable')
var request = require('request')

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/view/index.html')
})

app.get('/upload/:nickname', function (req, res) {
	res.sendFile(__dirname + '/view/upload.html')
})

app.post('/upload', function (req, res) {
	var receivedFields = {}

	function sendURL(_url) {
		var baseURL = 'http://uploader-levg34.rhcloud.com/'
		if (server_ip_address=='127.0.0.1') {
			baseURL=server_ip_address+':'+server_port
			baseURL=server_ip_address+':'+server_port
		}
		var url = baseURL+_url
		
		var postData = {
			nickname:receivedFields.nickname,
			event:'send_url',
			params:url
		}
		
		var headers = {
			'X-Auth-Token': receivedFields.token
		}

		var options = {
			url: 'http://nodechat-levg34.rhcloud.com/emit',
			//url: 'http://localhost:8080/emit', http://stackoverflow.com/questions/30128701/parse-form-value-with-formidable-to-filename
			method: 'post',
			headers: headers,
			body: postData,
			json: true
		}
		
		console.log(options)

		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		})
	}
	
	var form = new formidable.IncomingForm()
	
	form.parse(req).on('field', function(name, field) {
		receivedFields[name] = field
    })
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name
    })

    form.on('file', function (name, file){
		sendURL('/view/'+file.name)
		res.redirect('/view/'+file.name)
    })
})

app.get('/view/:image', function (req, res) {
	res.sendFile(__dirname + '/uploads/'+req.params.image)
})

server.listen(server_port,server_ip_address,function () {
	console.log("Listening on " + server_ip_address + ", port " + server_port)
})
