import Browser, { notifications } from 'webextension-polyfill'

console.log('Background Page running successfully')

// set default quality on first run
Browser.runtime.onInstalled.addListener(() => {
	Browser.storage.sync.set({ quality: 160, theme: 'dark', format: '$title' })
})

// open jiosaavn on clicking the extension icon
let c = 0
let timer: any
Browser.action.onClicked.addListener(async () => {
	++c
	timer && clearTimeout(timer)
	timer = setTimeout(() => {
		if (c > 1) Browser.runtime.openOptionsPage()
		else Browser.tabs.create({ url: 'https://www.jiosaavn.com/' })
		c = 0
	}, 200)
})

// Block ads
const adsURLs = ['https://*.saavn.com/web6/admanager/*', 'https://*.doubleclick.net/pagead/*']
const DNR = chrome.declarativeNetRequest
DNR.updateDynamicRules({
	removeRuleIds: [1099],
	addRules: [
		{
			id: 1099,
			priority: 1,
			action: { type: DNR.RuleActionType.BLOCK },
			condition: { domains: adsURLs, resourceTypes: [DNR.ResourceType.SCRIPT] },
		},
	],
})

// Update CSS based on Theme
Browser.tabs.onUpdated.addListener((id, info) => {
	if (info?.status !== 'loading') return
	Browser.tabs.get(id).then((tab) => {
		// Run only on jiosaavn.com
		const host = tab.url && new URL(tab.url).hostname
		if (!host?.includes('jiosaavn.com')) return
		Browser.storage.sync.get('theme').then((i) => {
			const CSS = {
				light:
					':root{--primary:#2cd8c4;--bg1:#f6f6f6;--bg2:#eee;--bg3:#bbb;--br:#e9e9e9;--tx1:#3e3e3e;--tx2:#555;--tx3:#888}',
				dark: ':root{--primary:#2cd8c4;--bg1:#18191a;--bg2:#242526;--bg3:#2e3031;--br:#292b2c;--tx1:#eee;--tx2:#888;--tx3:#555}',
			}
			const theme = (i.theme || 'light') as keyof typeof CSS
			Browser.scripting.insertCSS({ target: { tabId: id }, css: CSS[theme] })
		})
	})
})
