import path from 'node:path'
import { createRequire } from 'node:module'
import { renderSync } from 'node-sass'
import webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'

const { resolve: resolvePackage } = createRequire(import.meta.url)

const config = (env, argv) => {
	const isDev = argv.mode === 'development'
	const options = {
		entry: { downloader: './source/index' },
		output: {
			path: path.resolve('build'),
			filename: '[name].js',
			sourceMapFilename: '[name].js.map',
		},
		resolve: {
			alias: { react: 'jsx-dom' },
			extensions: ['.js', '.ts', '.tsx'],
		},
		plugins: [
			new webpack.ProvidePlugin({ React: 'react' }),
			new CopyPlugin({
				patterns: [
					{ from: resolvePackage('webextension-polyfill') },
					{ from: 'public' },
					{
						from: 'source/sass/*.sass',
						to: '[name].css',
						transform(c, p) {
							const option = { file: p, outputStyle: 'compressed' }
							return renderSync(option).css.toString()
						},
						globOptions: { ignore: ['**/_*.sass'] },
					},
				],
			}),
		],
		module: {
			rules: [
				{ test: /\.(t|j)sx?$/, resolve: { fullySpecified: false } },
				{ test: /\.tsx?$/, loader: 'esbuild-loader', options: { loader: 'tsx' } },
			],
		},
		devtool: isDev ? 'inline-source-map' : 'source-map',
		optimization: { minimize: true },
		stats: { all: false, errors: true },
	}
	return options
}

export default config
