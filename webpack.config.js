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
			options: './source/browser/options',
			background: './source/browser/background',
		},
		output: { path: path.resolve('build') },
		resolve: { extensions: ['.js', '.ts', '.tsx'] },
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: resolvePackage('webextension-polyfill') },
					{
						from: 'public',
						transform(content, file) {
							if (/\\public\\manifest\.json$/.test(file) === false) return content
							const manifest = JSON.parse(content)
							manifest.$schema = undefined
							if (!isDev) manifest.options_ui.open_in_tab = false
							return JSON.stringify(manifest)
						},
					},
					{
						from: 'source/sass/*',
						to: '[name].css',
						transform(content, file) {
							const opt = { file, outputStyle: 'compressed' }
							return renderSync(opt).css.toString()
						},
						globOptions: { ignore: ['**/_*.*'] },
					},
				],
			}),
		],
		module: {
			rules: [{ test: /\.tsx?$/, loader: 'esbuild-loader', options: { loader: 'tsx' } }],
		},
		devtool: isDev && 'inline-source-map',
		optimization: { minimize: true },
		stats: 'minimal',
	}
}
export default config
