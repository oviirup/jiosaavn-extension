import browser from 'webextension-polyfill'

console.log('Background Page running successfully')

// set default quality on first run
browser.runtime.onInstalled.addListener(() => {
	browser.storage.sync.set({ quality: '160' })
})

// open jiosaavn on clicking the extension icon
browser.browserAction.onClicked.addListener(() => {
	browser.tabs.create({ url: 'https://www.jiosaavn.com/' })
})

// prettier-ignore
const CSS = {
	light: ':root{--primary:#2cd8c4;--bg-1:#f6f6f6;--bg-2:#eee;--bg-3:#bbb;--border:#e9e9e9;--text-1:#3e3e3e;--text-2:#555;--text-3:#888}',
	dark: ':root{--primary:#2cd8c4;--bg-1:#18191a;--bg-2:#242526;--bg-3:#2e3031;--border:#292b2c;--text-1:#eee;--text-2:#888;--text-3:#555}',
}

const handlers: any = {}
interface RequestDetails extends browser.WebRequest.OnHeadersReceivedDetailsType {}
const cors = {
	onHeaderReceived(details: RequestDetails) {
		const host = details.url && new URL(details.url).hostname
		if (!host.includes('saavncdn.com') && !host.includes('cdnsrv.jio.com')) return
		// enable cors
		const { responseHeaders: H } = details
		const find = H?.find(({ name }) => name.toLowerCase() === 'access-control-allow-origin')
		if (find) find.value = '*'
		else H?.push({ name: 'Access-Control-Allow-Origin', value: '*' })
		return { responseHeaders: H }
	},
	install(id: number) {
		cors.remove(id)
		const newHandler = (details: RequestDetails) => cors.onHeaderReceived(details)
		handlers[id] = newHandler
		// Modify response headers
		browser.webRequest.onHeadersReceived.addListener(
			newHandler,
			{ urls: ['https://*.cdnsrv.jio.com/*', 'https://*.saavncdn.com/*'], tabId: id },
			['blocking', 'responseHeaders']
		)
	},
	remove(id: number) {
		browser.webRequest.onHeadersReceived.removeListener(handlers[id])
		delete handlers[id]
	},
}

// When tab updates url, check url and add CORS if need be
// Run only on jiosaavn.com
browser.tabs.onUpdated.addListener((id, info) => {
	if (info?.status == 'loading')
		browser.tabs.get(id).then((tab) => {
			const host = tab.url && new URL(tab.url).hostname
			if (!host?.includes('jiosaavn.com')) return
			cors.install(id)
			browser.storage.sync.get('theme').then((i) => {
				const theme: 'light' | 'dark' = i.theme || 'light'
				browser.tabs.insertCSS({ runAt: 'document_start', code: CSS[theme] })
			})
		})
})

browser.tabs.query({ title: 'Output Management' }).then((tabs) => {
	tabs.forEach(({ id }) => id && cors.install(id))
})
