import React from 'jsx-dom'
import { observe } from 'selector-observer'
import { getSongData, downloadSong } from '../utils'
import $ from 'jquery'

interface ButtonProps extends React.AllHTMLAttributes<HTMLElement> {}
const Button: React.FC<ButtonProps> = (props) => {
	const { ...attr } = props
	// prettier-ignore
	return (
		<div {...attr}>
			<span class='svd_dlI u-link'>
				<i class='o-icon--large o-icon-download' />
				<svg viewBox='0 0 24 24' height='24' width='24' fill='none' class='jsdSVG_r' strokeWidth='2' strokeLinecap='round'><circle cx='12' cy='12' r='11' /></svg>
			</span>
		</div>
	)
}

observe('li figcaption a.link-gray', {
	add(el) {
		const $el = $(el)
		const href = $el.attr('href')?.match(/.*\/(.*)/)
		const token = href ? href[1] : null
		if (!token) return

		const $parent = $el.parents('article.o-snippet')
		if ($parent.find('.jsdBTN_1').length) return
		const $last = $parent.find('.o-snippet__item:nth-last-of-type(2)')

		const attr = {
			class: 'jsdBTN_1 o-snippet__item u-margin-bottom-none@sm',
			style: { width: '30px' },
			onClick: async (e: any) => {
				e.target?.classList.add('prog')
				const data = await getSongData(token, 'song')
				if (!data) return
				downloadSong(data as any).finally(() => {
					e.target?.classList.remove('prog')
				})
			},
		}
		$last.before(<Button {...attr} />)
	},
})
