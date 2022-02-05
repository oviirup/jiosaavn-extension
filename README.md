# JioSaavn Downloader ![][sh_chrome]

![][sh_gh_stars] ![][sh_version] [![][sh_downloads]][release]

> This extension is still in the works. It is not yet ready for production use. It is still in the early stages of development. Many features are missing and bugs are still being worked on.
>
> The Download is working right but currently the files have _no metatags_, and downloading depends on _CORS_ so you need to enable it in your browser using extensions.

Simple and effective extension to download Songs, Albums, or Playlists from [jioSaavn.com](https://jioSaavn.com) with just one click. It also hides ads and promotions from JioSaavn Web and slightly tweaks the UI. Last but not least, it implements long-awaited **dark mode**.

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

After Fetching data it gets the URL of the song, album, or playlist in your desired quality settings. Then it creates an HTTP request to the server to fetch the M4A file. This step requires the CORS to be enabled in your browser.

In the case of a Playlist or an Album, it fetches the songs in the playlist and then downloads them one by one and puts them inside a zip file to download at once.

## Features

- [X] Added Dark Mode toggle.
- [X] Select Any Quality Downloads\
  Supports HD **320kbps**, Default: **160kbps**.
- [X] Download a Single Song.
- [X] Download Album, Playlist as ZIP file.
- [X] Blocks ADs and Promotions.
- [X] Modifies some of the UI Elements.
- [ ] Download Top songs from Artists.
- [ ] Download Podcast.
- [ ] Add metadata to the songs.

## Installation

This extension cannot hosted be in Chrome Webstore due to obvious reasons. You can manually install the extension just by following the steps...

### Prerequisites :

- [X] Developer Mode: Enable developer mode in your browser.\
  Go to [about://extensions/][about_ext] and check **Developer Mode** checkbox.
- [X] Download CORS unblock extension such as [Allow CORS unblocked][ext_cors]. This prevents any errors that may occur during downloading.\
  In future builds the requirement of this extension will be removed.


### Download and Install :

- Download the extension here : [download][download]
- Extract the zip file.
- Go to chrome extensions page : [about://extensions/][about_ext]
- You will see a button called **Load Unpacked Extension...** click that
- Select the extracted folder and click **Open**

[&#x21e1; Back to top](#)

<br/><br/>
Made with 💖 in India.

[about_ext]: about://extensions/
[ext_cors]: https://chrome.google.com/webstore/detail/lfhmikememgdcahcdlaciloancbhjino
[release]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases ' '
[download]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases/download/v22.2.5/release.zip 'Download'
[profile]: https://github.com/GrayGalaxy

<!--Images -->

[img_1]: https://user-images.githubusercontent.com/49820575/152336823-7ae2fa07-56a2-438e-9ff3-46a1d69566c6.jpg

<!-- Shields -->

[sh_gh_stars]: https://img.shields.io/github/stars/GrayGalaxy/jiosaavn-downloader.svg?logo=github&label=Stars
[sh_chrome]: https://img.shields.io/badge/-Chrome-black?logo=google-chrome&logoColor=white
[sh_version]: https://img.shields.io/github/manifest-json/v/graygalaxy/jiosaavn-downloader/main?label=Version
[sh_downloads]: https://img.shields.io/github/downloads/GrayGalaxy/jiosaavn-downloader/total?label=Downloads
