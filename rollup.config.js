import * as fs from 'fs';

let path = require('path');

import babel from 'rollup-plugin-babel';

// optional
import uglify from 'rollup-plugin-uglify-es';


export default [
{
	entry: 'src/playlist.js',
	indent: '\t',
	globals: { flowplayer: 'flowplayer' },
	plugins: [
		babel({
			externalHelpers: false,
			exclude: ['./node_modules/**'],
			presets: ['es2015-rollup']
		})
	],
	targets: [
		{
			format: 'umd',
			dest: 'dist/playlist.js'
		}
	]
},
{
	entry: 'src/playlist.js',
	indent: '\t',
	globals: { flowplayer: 'flowplayer' },
	plugins: [
		babel({
			externalHelpers: false,
			exclude: ['./node_modules/**'],
			presets: ['es2015-rollup']
		}),
		uglify({
	       output: {
	         comments: false
	       },
	    // Compression specific options
	       compress: {
	            warnings: true,
	            dead_code: true,
	            unused: true,
	            collapse_vars: true,
	            join_vars: true,
	            reduce_vars: true,
	            passes: 2,
	         // Drop console statements
	            drop_console: true
	       }
	     })
	],
	targets: [
		{
			format: 'umd',
			//moduleName: 'THREE',
			dest: 'dist/playlist.min.js'
		}
	]
},
{
	entry: 'src/playlist-ui.js',
	indent: '\t',
	globals: { flowplayer: 'flowplayer' },
	plugins: [
		babel({
			externalHelpers: false,
			exclude: ['./node_modules/**'],
			presets: ['es2015-rollup']
		})
	],
	targets: [
		{
			format: 'umd',
			dest: 'dist/playlist-ui.js'
		}
	]
},
{
	entry: 'src/playlist-ui.js',
	indent: '\t',
	globals: { flowplayer: 'flowplayer' },
	plugins: [
		babel({
			externalHelpers: false,
			exclude: ['./node_modules/**'],
			presets: ['es2015-rollup']
		}),
		uglify({
	       output: {
	         comments: false
	       },
	    // Compression specific options
	       compress: {
	            warnings: true,
	            dead_code: true,
	            unused: true,
	            collapse_vars: true,
	            join_vars: true,
	            reduce_vars: true,
	            passes: 2,
	         // Drop console statements
	            drop_console: true
	       }
	     })
	],
	targets: [
		{
			format: 'umd',
			//moduleName: 'THREE',
			dest: 'dist/playlist-ui.min.js'
		}
	]
}
]