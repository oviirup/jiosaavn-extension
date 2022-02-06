import React from 'jsx-dom'
import { observe } from 'selector-observer'
import { getSongData, downloadList } from '../utils'
import $ from 'jquery'

type T = 'playlist' | 'album'
interface ButtonProps extends React.AllHTMLAttributes<HTMLElement> {}
const Button: React.FC<ButtonProps> = (props) => {
	const { ...attr } = props
	// prettier-ignore
	return (
		<div {...attr}>
			<span class='svd_dlI c-btn c-btn--tertiary c-btn--ghost c-btn--icon'>
				<i class='o-icon--large o-icon-download' />
				<svg viewBox='0 0 24 24' height='24' width='24' fill='none' class='jsdSVG_r' strokeWidth='2' strokeLinecap='round'><circle cx='12' cy='12' r='11' /></svg>
			</span>
		</div>
	)
}

const addButton = (el: Element, type: T) => {
	const $el = $(el)
	const href = window.location.href.match(/.*\/(.*)/)
	const token = href ? href[1] : null

	if (!token) return

	const $first = $el.find('.o-layout__item:first-of-type')
	if ($first.find('.jsdBTN_2').length) return

	const attr = {
		class: 'jsdBTN_2 o-layout__item u-margin-bottom-none@sm',
		onClick: async (e: any) => {
			e.target?.classList.add('prog')
			const data = await getSongData(token, type as any)
			if (!data) return
			console.log(data)
			downloadList(data as any).finally(() => {
				e.target?.classList.remove('prog')
			})
		},
	}
	$first.after(<Button {...attr} />)
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
