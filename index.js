var server_port = process.env.PORT || 9000

var express = require('express')
var app = express()
var server = require('http').createServer(app)
var formidable = require('formidable')
var request = require('request')
var fs = require('fs')

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/view/index.html')
})

app.get('/upload', function (req, res) {
	res.sendFile(__dirname + '/view/upload.html')
})

app.get('/upload/:nickname', function (req, res) {
	res.sendFile(__dirname + '/view/upload.html')
})

app.post('/upload', function (req, res) {
	var receivedFields = {}

	function sendURL(_url) {
		var baseURL = 'http://uploader-levg34.herokuapp.com'
		/*if (server_ip_address=='127.0.0.1') {
			baseURL=server_ip_address+':'+server_port // TODO: check ip address
		}*/
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
			url: 'http://node-minou.herokuapp.com/emit',
			//url: 'http://localhost:8080/emit', http://stackoverflow.com/questions/30128701/parse-form-value-with-formidable-to-filename
			method: 'post',
			headers: headers,
			body: postData,
			json: true
		}

		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				//console.log({error:error, response:response, body:body})
			} else {
				console.log({error:error, response:response, body:body})
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
		if (receivedFields.nickname&&receivedFields.token) {
			sendURL('/view/'+file.name)
		}
		res.redirect('/?success='+file.name)
    })
})

app.get('/view/:image', function (req, res) {
	res.sendFile(__dirname + '/uploads/'+req.params.image)
})

app.delete('/delete/:image', function (req, res) {
	var file = 'uploads/'+req.params.image
	try {
		fs.unlinkSync(file)
		res.sendStatus(200)
	} catch (e) {
		res.status(500).send(e.message)
	}
})

app.get('/images', function (req, res) {
	var uploaded_files = []
	fs.readdirSync(__dirname + '/uploads/').forEach(file => {
		if (file != ".gitkeep") {
			var url = req.protocol+'://'+req.get('host')+'/view/'+file
			uploaded_files.push({name:file,url:url})
		}
	})
	res.json(uploaded_files)
})

server.listen(server_port,function () {
	console.log("Listening on port " + server_port)
})
