import path from 'node:path'
import { createRequire } from 'node:module'
import { renderSync } from 'node-sass'
import CopyPlugin from 'copy-webpack-plugin'
const { resolve: resolvePackage } = createRequire(import.meta.url)

const config = (env, argv) => {
	const isDev = argv.mode === 'development'
	return {
		entry: {
			downloader: './source/index',
			options: './source/options',
		},
		output: { path: path.resolve('build') },
		resolve: { extensions: ['.js', '.ts', '.tsx'] },
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: resolvePackage('webextension-polyfill') },
					{ from: 'public' },
					{
						from: 'source/sass/*.sass',
						to: '[name].css',
						transform: (c, file) => renderSync({ file, outputStyle: 'compressed' }).css.toString(),
						globOptions: { ignore: ['**/_*.sass'] },
					},
				],
			}),
		],
		module: {
			rules: [{ test: /\.tsx?$/, loader: 'esbuild-loader', options: { loader: 'tsx' } }],
		},
		devtool: isDev && 'inline-source-map',
		optimization: { minimize: true },
		stats: { all: false, errors: true },
	}
}
export default config
