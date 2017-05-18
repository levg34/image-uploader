var server_port = process.env.OPENSHIFT_NODEJS_PORT || 9000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var express = require('express')
var app = express()
var server = require('http').createServer(app)
var formidable = require('formidable')
var fs = require('fs')

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/view/index.html')
})

app.get('/upload/:nickname', function (req, res) {
	res.sendFile(__dirname + '/view/upload.html')
})

app.post('/upload', function (req, res) {
	var form = new formidable.IncomingForm()
	console.log('about to parse')
	form.parse(req, function (error, fields, files) {
		console.log('parsing done')
		console.log(files.upload.path)

		/* Possible error on Windows systems:
		 tried to rename to an already existing file */
		fs.rename(files.upload.path, './public/img/test.png', function (error) {
			if (error) {
				fs.unlink('./public/img/test.png')
				fs.rename(files.upload.path, './public/img/test.png')
			}
		});
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.write('received image:<br/>')
		res.write('<img src="/img/test.png"/>')
		res.end()
	});
})

server.listen(server_port,server_ip_address,function () {
	console.log("Listening on " + server_ip_address + ", port " + server_port)
})
