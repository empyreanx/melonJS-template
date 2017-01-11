'use strict';

const babel = require('rollup-plugin-babel');
const builtins = require('rollup-plugin-node-builtins');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require("rollup-plugin-uglify");
const rollup = require('rollup-stream');

/*var nodeModules = [
	'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
	'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https',
	'module', 'net', 'os', 'path', 'process', 'punycode', 'querystring',
	'readline', 'repl', 'stream', 'string_decoder', 'timers', 'tls', 'tty',
	'url', 'util', 'v8', 'vm', 'zlib'
];

var appModules = function () {
    var appManifest = require('../app/package.json');
    return Object.keys(appManifest.dependencies);
};

var externalModules = function () {
    return [].concat(nodeModules, appModules());
};*/

module.exports = function (entry, minify, format, moduleName) {
	minify = !!minify;
	format = format || 'cjs';

	if (format === 'umd' && typeof moduleName !== 'string') {
		throw new Error('Module must be specified for UMD modules');
	}

	var plugins = [
		builtins(),
		resolve(),
		commonjs({
			include: 'node_modules/**',
			namedExports: {
				'node_modules/chai/index.js' : ['expect']
			}
		}),
		babel({
			exclude: 'node_modules/**'
		})
	];

	if (minify) {
		plugins.push(uglify());
	}

    return rollup({
        entry: entry,
        //external: externalModules(),
		useStrict: false,
		//external: ['buffer', 'path', 'url'],
		format: format,
		moduleName: moduleName,
		sourceMap: true,
		plugins: plugins
    });
};
