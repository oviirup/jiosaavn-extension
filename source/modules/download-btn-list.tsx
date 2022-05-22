import React from 'jsx-dom'
import { observe } from 'selector-observer'
import { getSongData, downloadList } from './request'
import Button from './Button'
import $ from 'jquery'

type T = 'playlist' | 'album'

const addButton = (el: Element, type: T) => {
	const $el = $(el)
	const href = window.location.href.match(/.*\/(.*)/)
	const token = href && href[1]
	if (!token) return

	const $first = $el.find('.o-layout__item:first-of-type')
	if ($first.find('.jsdBTN_2').length) return

	const attr = {
		class: 'jsdBTN_2 o-layout__item u-margin-bottom-none@sm',
		onClick: async (e: any) => {
			const $T = $(e.target)
			$T.addClass('pending')
			const data = await getSongData(token, type as any)
			if (data) {
				console.log(data)
				$T.addClass('progress')
				await downloadList(data as any)
			}
			$T.removeClass('pending').removeClass('progress')
		},
	}
	$first.after(<Button large {...attr} data-token={token} />)
}

observe('figure .o-layout', {
	add(el) {
		let type: T | null = null
		if ($('#root > .featured').length) type = 'playlist'
		else if ($('#root > .s').length) type = 'playlist'
		else if ($('#root > .album').length) type = 'album'
		else return
		addButton(el, type)
	},
})
