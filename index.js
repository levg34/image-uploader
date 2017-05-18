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
	var nickname = ''
	var token = ''

	function sendURL(_url) {
		var baseURL = 'http://uploader-levg34.rhcloud.com/'
		if (server_ip_address=='127.0.0.1') {
			baseURL=server_ip_address+':'+server_port
			baseURL=server_ip_address+':'+server_port
		}
		var url = baseURL+_url
		
		var postData = {
			nickname:nickname,
			event:'send_url',
			params:url
		}
		
		var headers = {
			'X-Auth-Token': token
		}

		var options = {
			url: 'http://nodechat-levg34.rhcloud.com/emit',
			//url: 'http://localhost:8080/emit',
			method: 'post',
			headers: headers,
			body: postData,
			json: true
		}

		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		})
	}
	
	var form = new formidable.IncomingForm()
	
	form.parse(req, function(err, fields, files) {
		token = fields.token
		nickname = fields.nickname
		console.log('parse: '+nickname+' - '+token)
	})

    form.on('fileBegin', function (name, file){
		console.log('fileBegin: '+nickname+' - '+token)
        file.path = __dirname + '/uploads/' +nickname+'-'+ file.name
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
