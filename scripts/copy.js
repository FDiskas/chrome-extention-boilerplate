var fs = require("fs");
var path = require('path');
var fsex = require('fs-extra');
var sanitize = require("sanitize-filename");

// http://nodejs.org/api.html#_child_processes
var dist = path.resolve(__dirname + '/../dist');
var src = path.resolve(__dirname + '/../src');

// Clean dist directory, copy source files and remove unneeded files/dirs
fsex.emptyDirSync(dist);

// Copy source files
fsex.copySync(src, dist);
console.log(` ✔ Successfully copied to dist.`);
