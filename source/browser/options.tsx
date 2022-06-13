import React, { styled } from 'jsx-dom'
import Browser from 'webextension-polyfill'
import $ from 'jquery'

const ROOT = document.getElementById('root')

const Heading = styled.h2`font-size:1.25rem;font-weight:400;margin-bottom:0.75rem;border-bottom:1px solid var(--br);`
const Label = styled.label`display:flex;flex-direction:row;gap:0.5rem;align-items:center;cursor:pointer;height:2rem;`
const Knob = styled.svg`position:absolute;pointer-events:none;left:0;fill:var(--bg);border-radius:2px;height:20px;width:20px;stroke:none;`
const A = styled.a`color:var(--tx) !important;opacity:0.5;`
const Choice = styled.input`width:20px;height:20px;appearance:none;margin-top:-2px`
const Text = styled.input`width:100%;height:32px;padding:0 0.5rem;border-radius:4px;border:1px solid var(--br);color:var(--tx);`
const Sm = styled.small`opacity:0.5;`

interface InputElement extends React.AllHTMLAttributes<HTMLInputElement> {}
const CheckBox: React.FC<InputElement> = (props) => {
	const { className, children, ...attr } = props
	return (
		<Label class={`simple-check ${className || ''}`}>
			<div class='check'>
				<Choice type='checkbox' {...attr} />
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
			<Choice type='radio' class='radio' {...attr} />
			{children}
		</Label>
	)
}
const TextBox: React.FC<InputElement> = (props) => {
	const { className, ...attr } = props
	return (
		<Label class={`simple-text ${className || ''}`}>
			<Text type='text' class='textbox' {...attr} />
		</Label>
	)
}

$(document).ready(async () => {
	const store = await Browser.storage.sync.get(['theme', 'quality', 'format', 'notify'])

	const bug_report = 'https://github.com/GrayGalaxy/jiosaavn-extension/issues/new?assignees=GrayGalaxy&labels=bug&template=bug_report.yaml&title=%5BBug%5D%3A+'
	const feature_request = 'https://github.com/GrayGalaxy/jiosaavn-extension/issues/new?assignees=GrayGalaxy&labels=enhancement&template=feature_request.yaml&title=%5BFeature%5D%3A+'

	const changeTheme = (e: any) => {
		const theme = e.target.checked ? 'dark' : 'light'
		Browser.storage.sync.set({ theme })
	}
	const changeQuality = (e: any) => Browser.storage.sync.set({ quality: e.target.value })
	const changeNameFormat = (e: any) => Browser.storage.sync.set({ format: e.target.value })
	const updateNotify = (e: any) => Browser.storage.sync.set({ notify: e.target.checked })

	const qualities = Object.entries({ 320: 'Extreme', 160: 'Best', 96: 'Good', 48: 'Fair', 12: 'Low' })
	ROOT!.appendChild(<>
		<Heading>Download Quality</Heading>
		<p>Select the quality of audio you want to download. Extreame is preferred.</p>
		<form onChange={changeQuality}>
			{qualities.reverse().map(([q, text]) => (
				<RadioBox checked={store.quality == q} value={q} name='quality'>
					{text}
					<Sm>({q} kbps)</Sm>
				</RadioBox>
			))}
		</form>
		<Heading>Naming Format</Heading>
		<p>Formatting style for naming the downloaded files</p>
		<TextBox value={store.format} placeholder='$title - $album_artist' onChange={changeNameFormat}/>
		<Sm><b>Format : </b> $title, $album_artist, $artists, $album, $year, $track, $genre, $bitrate</Sm>
		<br />
		<Heading>Miscellaneous</Heading>
		<CheckBox checked={store.theme === 'dark'} onChange={changeTheme}>
			Enable Dark mode
		</CheckBox>
		<CheckBox checked={store.notify} onChange={updateNotify}>
			Notify when new version is available
		</CheckBox>
		<p>
			<A href={bug_report}>Bug Report</A> • <A href={feature_request}>Feature Request</A>
		</p>
		<p>For more information, visit <A href='https://github.com/GrayGalaxy/jiosaavn-extension#readme' target='_blank'>the readme page</A>.</p>
	</>)
})

export {}
