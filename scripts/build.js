var chromeExe = require('chrome-location');
var fs = require("fs");
var path = require('path');
var fsex = require('fs-extra');
var archiver = require('archiver');
var prettyBytes = require('pretty-bytes');
var sanitize = require("sanitize-filename");

// http://nodejs.org/api.html#_child_processes
var exec = require('child_process').exec;
var root = path.resolve(__dirname + '/..');
var dist = path.resolve(__dirname + '/../dist');

// chromeExe --pack-extension=C:\myext --pack-extension-key=C:\myext.pem
var command = `${chromeExe} --pack-extension=${dist}`;

exec(command, function (err) {
    if (err) {
        return console.log(` ✘ ${err}`);
    }
    else {
        var fileName = `${dist}/manifest.json`;
        var extension = require(fileName);
        var filename = sanitize(extension.name);

        // Zip dir
        var output = fs.createWriteStream(`${dist}/${filename}.zip`);
        var archive = archiver.create('zip', {});

        archive.pipe(output);
        archive.bulk([
            {
                expand: true,
                cwd: dist,
                src: ["**/*.!(zip|crx|pem)"],
                dot: false
            }
        ]);
        archive.on('error', function(err) { return console.log(` ✘ ${err}`); });
        archive.finalize();

        output.on('close', function() {
            fsex.move(`${root}/dist.crx`, `${dist}/${filename}.crx`, function(err) {
                if ( err ) {
                    return console.log(` ✘ ${err}`);
                }
                fsex.move(`${root}/dist.pem`, `${dist}/${filename}.pem`, function (err) {
                    if ( err ) {
                        return console.log(` ✘ ${err}`);
                    }
                    fsex.removeSync(`${dist}/**/*.!(zip|crx|pem)`);
                    console.log(` ✔ Build success. Released version:${extension.version} Zip size:${prettyBytes(archive.pointer())} Files: "dist/${filename}.crx" "dist/${filename}.zip"`);
                });
            });
        });
    }
});
