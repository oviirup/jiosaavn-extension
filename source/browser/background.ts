import browser from 'webextension-polyfill'

// set default quality
const { quality }: any = browser.storage.sync.get(['quality'])
if (!quality) browser.storage.sync.set({ quality: '160' })

interface RequestDetails extends browser.WebRequest.OnHeadersReceivedDetailsType {}

console.log('Background Page running successfully')

const handlers: any = {}
const cors = {
	onHeaderReceived(details: RequestDetails) {
		const host = details.url && new URL(details.url).hostname

		if (!host.includes('saavncdn.com') && !host.includes('cdnsrv.jio.com')) return
		console.log(details.url)
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
		// Modufy response headers
		browser.webRequest.onHeadersReceived.addListener(
			newHandler,
			{ urls: ['<all_urls>'], tabId: id },
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
			if (host?.includes('jiosaavn.com')) cors.install(id)
		})
})

browser.tabs.query({ title: 'Output Management' }).then((tabs) => {
	tabs.forEach(({ id }) => id && cors.install(id))
})
