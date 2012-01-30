var spawn = require('child_process').spawn;
var binPath = 'metaflac';

var metaflac = function (args, callback) {
	var out = '';
	var mf = spawn(binPath, args);
	mf.stdout.on('data', function (data) {
		out += data;
	});

	mf.on('exit', function (code) {
		if (code !== 0) {
			callback({ 'code' : code }, null)
		} else {
			callback(null, out)
		}
	});
};

var vorbisComment = function (path, callback) {
	metaflac([
		'--list', 
		'--block-type=VORBIS_COMMENT', 
		path
	], function (error, data) {
		if (error) {
			callback({ 'message' : 'problem' }, null);
			return;
		}

		var tags = {};
		var regex = /:\s+(.+)=(.+)$/;

		var lines = data.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var matches = regex.exec(line);

			if (matches) {
				tags[matches[1]] = matches[2];
			}
		}

		callback(null, tags);
	});
};

exports.vorbisComment = vorbisComment;