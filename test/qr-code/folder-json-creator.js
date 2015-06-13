var http = require('http');
var url = require('url');
var qr = require('qr-image');
var fs = require('fs');
var path = require('path');
var args = process.argv.slice(2);
var FILEPATH = args[0];
var async = require('async');

if(!path.parse){
	path.parse = require('path-parse');
}

function parseFiles(root){
	var files = fs.readdirSync(root);
	var funcs = [];
	files.forEach(function (filename, index, array) {
	  funcs.push(function(callback){ parseFile(root, filename, callback); });
	});
	async.series(funcs, function(err, results){
		console.log('all files are parsed');
	});
}

function parseFile(root, filename, next){
	var file_parts = path.parse(root + '/' + filename);
	if(file_parts.ext !== '.json'){
		next();
		return false;
	}
	var json = require(root + '/' + filename);
	var savePath = root + '/' + file_parts.name + '.png';
	var json_str = JSON.stringify(json);
	var img = qr.image(json_str, { type: 'png' });
	var file_stream = fs.createWriteStream(savePath);
	img.pipe(file_stream);
	file_stream.on('finish', function(){ next(); });
}

parseFiles(FILEPATH);