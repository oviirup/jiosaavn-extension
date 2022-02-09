import React, { styled } from 'jsx-dom'
import browser from 'webextension-polyfill'
import $ from 'jquery'

const ROOT = document.getElementById('root')

const Heading = styled.h2`font-size:1.25rem;font-weight:400;margin-bottom:0.75rem;border-bottom:1px solid var(--br);`
const Label = styled.label`display:flex;flex-direction:row;gap:0.5rem;align-items:center;cursor:pointer;height:2rem;`
const Knob = styled.svg`position:absolute;pointer-events:none;left:0;fill:var(--bg);border-radius:2px;height:20px;width:20px;stroke:none;`
const A = styled.a`color:var(--tx) !important;opacity:0.5;`
const Input = styled.input`cursor:pointer;margin:0;ouline:0;width:20px;height:20px;appearance:none;`
const Sm = styled.small`opacity:0.5;`

interface InputElement extends React.AllHTMLAttributes<HTMLInputElement> {}
const CheckBox: React.FC<InputElement> = (props) => {
	const { className, children, ...attr } = props
	return (
		<Label class={`simple-check ${className || ''}`}>
			<div class='check'>
				<Input type='checkbox' {...attr} />
				<Knob viewBox='0 0 20 20' class='knob'><path d='M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z' fillRule='evenodd' clipRule='evenodd' /></Knob>
			</div>
			{children}
		</Label>
	)
}
const RadioBox: React.FC<InputElement> = (props) => {
	const { className, children, ...attr } = props
	return (
		<Label class={`simple-radio ${className || ''}`}>
			<Input type='radio' class='radio' {...attr} />
			{children}
		</Label>
	)
}

$(document).ready(async () => {
	const { theme, quality = 160 } = await browser.storage.sync.get(['theme', 'quality'])
	const changeTheme = (e: any) => {
		const theme = e.target.checked ? 'dark' : 'light'
		browser.storage.sync.set({ theme })
	}
	const changeQuality = (e: any) => {
		const value = e.target.value
		browser.storage.sync.set({ quality: value })
	}

	const qualities = Object.entries({ 320: 'Extreme', 160: 'Best', 96: 'Good', 48: 'Fair', 12: 'Low' })
	ROOT!.appendChild(
		<>
			<Heading>Dark Mode</Heading>
			<p>Adjust the appearance of JioSaavn to reduce glare and give your eyes a break.</p>
			<CheckBox checked={theme === 'dark'} onChange={changeTheme}>
				Enable Dark mode
			</CheckBox>
			<Sm>Currently the DarkMode ON by default.</Sm>
			<Heading>Download Quality</Heading>
			<p>Select the quality of audio you want to download. Extreame is preferred.</p>
			<form onChange={changeQuality}>
				{qualities.reverse().map(([q, text]) => (
					<RadioBox checked={quality == q} value={q} name='quality'>
						{text}
						<Sm>({q} kbps)</Sm>
					</RadioBox>
				))}
			</form>
			<br />
			<p>
				For more information, visit{' '}<A href='https://github.com/GrayGalaxy/jiosaavn-downloader#readme' target='_blank'>the readme page
				</A>.
			</p>
		</>
	)
})

export {}
