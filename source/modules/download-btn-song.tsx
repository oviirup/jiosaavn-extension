import React from 'jsx-dom'
import { observe } from 'selector-observer'
import { Button, getSongData, downloadSong } from '../utils'
import $ from 'jquery'
import { Song } from '../types'

observe('li figcaption a.link-gray', {
	add(el) {
		const $el = $(el)
		const href = $el.attr('href')?.match(/.*song\/.*\/(.*)/)
		const token = href ? href[1] : null
		if (!token) return

		const $parent = $el.parents('article.o-snippet')
		if ($parent.find('.jsdBTN_1').length) return
		const $last = $parent.find('.o-snippet__item:nth-last-of-type(2)')

		let cancel: any = null
		const attr = {
			class: 'jsdBTN_1 o-snippet__item u-margin-bottom-none@sm',
			style: { width: '30px' },
			onClick: async (e: any) => {
				const $T = $(e.target)
				$T.addClass('pending')
				const data = await getSongData(token, 'song') as Song
				if (data) {
					if($T.hasClass('progress')) cancel()
					else {
						$T.addClass('progress')
						await downloadSong(data, (c) => (cancel = c))
					}
				}
				$T.removeClass('pending').removeClass('progress')
			},
		}
		$last.before(<Button {...attr} data-token={token} />)
	},
})

observe('#root > .song figure .o-layout', {
	add(el) {
		const $el = $(el)
		const href = window.location.href.match(/.*song\/.*\/(.*)/)
		const token = href && href[1]
		if (!token) return

		const $first = $el.find('.o-layout__item:first-of-type')
		if ($first.find('.jsdBTN_2').length) return

		const attr = {
			class: 'jsdBTN_2 o-layout__item u-margin-bottom-none@sm',
			onClick: async (e: any) => {
				const $T = $(e.target)
				$T.addClass('pending')
				const data = (await getSongData(token, 'song')) as Song
				if (data){
					$T.addClass('progress')
					await downloadSong(data)
				}
				$T.removeClass('pending').removeClass('progress')
			},
		}
		$first.after(<Button large {...attr} />)
	},
})
