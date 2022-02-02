# JioSaavn Downloader ![][sh_chrome]

![][sh_gh_stars] ![][sh_version] [![][sh_downloads]][release]

> This extension is still in the works. It is not yet ready for production use. It is still in the early stages of development. Many features are missing and bugs are still being worked on.

Simple and effective extension to download Songs, Albums, or Playlists from _jioSaavn.com_ with just one click. It also hides ads and promotions from JioSaavn Web and slightly tweaks the UI. Last but not least, it implements long-awaited **dark mode**.

Give it a star if you love the extension.\
[Follow][profile] me if you want to get updates on my repos.

You can download the extension from the following [link][download].\
<small>You can also go through how to install it if you are struggling.</small>

<details>
	<summary><b>Contents</b></summary>
	<ul>
		<li><a href='#how-it-works'>How It Works</a></li>
		<li><a href='#features'>Features</a></li>
		<li><a href='#installation'>Installation</a></li>
		<li><a href='#behind-the-scenes'>Behind the Scenes</a></li>
	</ul>
</details>

This extension is still in development, some of its features are still in the making.

![JioSaavn Dark Mode][img_1]

## How It Works

It fetches data from the API endpoints of JioSaavn, organizes them in a useful manner. All this happens within the browser and does not rely on external servers.

After Fetching data it gives out a MP3 file with neatly organized tags and album art with the help of `ID3.js`

## Features

- Added Dark Mode
- Select Any Quality Downloads (Supports HD 320kbps)
- Download a Single Song \*
- Download Album, Playlist as zip \*
- Blocks ADs and Promotions
- Modifies some of the UI Elements.

<small>\* Working on it</small>

## Installation

This extension cannot hosted be in Chrome Webstore due to obvious reasons. You can manually install the extension just by following the steps...

- Download the extension here : [download][download]
- Extract the zip file.
- Go to chrome extensions page : [about://extensions/](about://extensions/ ' ')
- You will see a button called **Load Unpacked Extension...** click that
- Select the extracted folder and click **Open**\
  <small>
  Note: <strong>Developer mode</strong> is required to enable the extension. You can see a toggle button promptly named "Developer Mode". Turn on to enable the Developer mode.<br>
  You might get a **Turn off Developer Mode** notification every time you open the browser if you are using Stable versions of chrome. You can use Chrome Dev or Canary if that notification annoys you.
  </small>

[&#x21e1; Back to top](#)

<br/><br/>
Made with 💖 in India.

[release]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases ' '
[download]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases/download/v0.7.3/release.zip 'Download'
[profile]: https://github.com/GrayGalaxy

<!--Images -->

[img_1]: https://user-images.githubusercontent.com/49820575/141003468-cd7dccc8-1822-457e-b537-36b8fe4e0c31.jpg

<!-- Shields -->

[sh_gh_stars]: https://img.shields.io/github/stars/GrayGalaxy/jiosaavn-downloader.svg?logo=github&label=Stars
[sh_chrome]: https://img.shields.io/badge/-Chrome-black?logo=google-chrome&logoColor=white
[sh_version]: https://img.shields.io/github/manifest-json/v/graygalaxy/jiosaavn-downloader/main?label=Version
[sh_downloads]: https://img.shields.io/github/downloads/GrayGalaxy/jiosaavn-downloader/total?label=Downloads
