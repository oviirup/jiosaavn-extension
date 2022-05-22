import Browser from 'webextension-polyfill'
import axios from 'axios'

console.log('Background Page running successfully')

// set default quality on first run
Browser.runtime.onInstalled.addListener(() => {
	Browser.storage.sync.set({ quality: 160, theme: 'dark', format: '$title' })
})

// open jiosaavn on clicking the extension icon
let c = 0,
	timer: any = null
Browser.browserAction.onClicked.addListener(async () => {
	++c
	timer && clearTimeout(timer)
	timer = setTimeout(() => {
		if (c > 1) Browser.runtime.openOptionsPage()
		else Browser.tabs.create({ url: 'https://www.jiosaavn.com/' })
		c = 0
	}, 200)
})

const CSS = {
	light:
		':root{--primary:#2cd8c4;--bg-1:#f6f6f6;--bg-2:#eee;--bg-3:#bbb;--border:#e9e9e9;--text-1:#3e3e3e;--text-2:#555;--text-3:#888}',
	dark: ':root{--primary:#2cd8c4;--bg-1:#18191a;--bg-2:#242526;--bg-3:#2e3031;--border:#292b2c;--text-1:#eee;--text-2:#888;--text-3:#555}',
}

const adURLS = ['https://staticfe.saavn.com/web6/admanager/*', 'https://*.doubleclick.net/pagead/*']

const handlers: any = {}
interface RequestDetails extends Browser.WebRequest.OnHeadersReceivedDetailsType {}
const cors = {
	onHeaderReceived(details: RequestDetails) {
		const { responseHeaders: H } = details
		const find = H?.find(({ name }) => name.toLowerCase() === 'access-control-allow-origin')
		if (find) find.value = '*'
		else H?.push({ name: 'Access-Control-Allow-Origin', value: '*' })
		return { responseHeaders: H }
	},
	install(id: number) {
		cors.remove(id)
		const newHandler = cors.onHeaderReceived
		handlers[id] = newHandler
		// Modify response headers
		Browser.webRequest.onHeadersReceived.addListener(
			newHandler,
			{ urls: ['https://*.cdnsrv.jio.com/*', 'https://*.saavncdn.com/*'], tabId: id },
			['blocking', 'responseHeaders', 'extraHeaders']
		)
		// proper adblocker support
		Browser.webRequest.onBeforeRequest.addListener(
			() => ({ cancel: true }),
			{ urls: adURLS, tabId: id },
			['blocking']
		)
	},
	remove(id: number) {
		Browser.webRequest.onHeadersReceived.removeListener(handlers[id])
		delete handlers[id]
	},
}

// Run only on jiosaavn.com
Browser.tabs.onUpdated.addListener((id, info) => {
	if (info?.status !== 'loading') return
	Browser.tabs.get(id).then((tab) => {
		const host = tab.url && new URL(tab.url).hostname
		if (!host?.includes('jiosaavn.com')) return
		cors.install(id)
		Browser.storage.sync.get('theme').then((i) => {
			const theme = (i.theme || 'light') as 'light' | 'dark'
			console.log(12);

			Browser.tabs.insertCSS({ runAt: 'document_start', code: CSS[theme] })
		})
	})
})

Browser.tabs.query({ url: 'https://www.jiosaavn.com/*' }).then((tabs) => {
	tabs.forEach(({ id }) => id && cors.install(id))
})
