import React from 'jsx-dom'

interface ButtonProps extends React.AllHTMLAttributes<HTMLElement> {
	large?: boolean
}
function Button(props: ButtonProps) {
	const { large = false, ...attr } = props
	const iconClass = large ? 'c-btn c-btn--tertiary c-btn--ghost c-btn--icon' : 'u-link'
	const w = large ? 24 : 36
	return (
		<div {...attr}>
			<span class={`jsdDlI ${iconClass}`}>
				<i class='o-icon--large o-icon-download' />
				<svg viewBox={`0 0 ${w} ${w}`} height={w} width={w} fill='none' strokeWidth={large?2:1} strokeLinecap='round'><circle cx={w/2} cy={w/2} r={w/2-1} /></svg>
			</span>
		</div>
	)
}

export default Button