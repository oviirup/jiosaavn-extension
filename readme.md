# JioSaavn Downloader ![][sh_chrome]

[![][sh_gh_stars]](#) [![][sh_version]](#) [![][sh_downloads]][release]

> This extension is still in the works. It is not yet ready for production use. It is still in the early stages of development. Many features are missing and bugs are still being worked on.
>
> The Download is working right but currently the files have _no metatags_.

Simple and effective extension to download Songs, Albums, or Playlists from [jioSaavn.com](https://jioSaavn.com) with just one click. It also hides ads and promotions from JioSaavn Web and slightly tweaks the UI. Last but not least, it implements a long-awaited **dark mode****.

Give it a star if you love the extension.\
[Follow me][profile] if you want to get updates on repos like this.

You can download the extension from the following [link][download].\
<small>You can also go through how to install it if you are struggling.</small>

<details>
 <summary><b>Table of Contents</b></summary>
 <ul>
  <li><a href='#how-it-works'>How It Works</a></li>
  <li><a href='#features'>Features</a></li>
  <li><a href='#how-to-use'>How to Use</a></li>
    <ul>
      <li><a href='#prerequisites'>Prerequisites</a></li>
      <li><a href='#download-and-install'>Downnloaad and install</a></li>
      <li><a href='#customizing-the-extension'>Customize Extension</a></li>
    </ul>
  <li><a href='#credits'>Credits</a></li>
 </ul>
</details>

This extension is still in development, and some of its features are still in the making.

![JioSaavn Dark Mode][img_1]

## How It Works

It fetches data from the API endpoints of JioSaavn and organizes them in a useful manner. All this happens within the browser and does not rely on external servers.

After Fetching data it gets the URL of the song, album, or playlist in your desired quality settings. Then it creates an HTTP request to the server to fetch the M4A file. This step requires the CORS to be enabled in your browser. In previous builds, it requires you to use another extension, but in newer builds, it is baked in.

In the case of a Playlist or an Album, it fetches the songs in the playlist and then downloads them one by one and puts them inside a zip file to download at once.

## Features

- [x] Added Dark Mode toggle.
- [x] Select Any Quality Downloads\
      Supports HD **320kbps**, Default: **160kbps**.
- [x] Download a **Songs**.
- [x] Download **Album**, and **Playlist** as ZIP files.
- [x] **Blocks ADs** and Promotions.
- [x] Modifies some of the UI Elements.
- [x] **Cancel Download** button for songs.
- [x] **Update Notification** for new releases of the extension.

### Upcomming Features

- [ ] Download Progressbar
- [ ] Download Top songs from Artists.
- [ ] Cancel Download button for Lists or Album downloads.
- [ ] Download Podcast.
- [ ] Add metadata to the songs.

## How to Use

This extension cannot hosted be in Chrome Webstore due to obvious reasons. You can manually install the extension just by following the steps...

You can go to _jiosaavn.com_ just by **single-click** on the extension icon, no need to add extra bookmarks, and **double-click** to open the _extension options_.

### Prerequisites

- [x] Developer Mode: Enable developer mode in your browser.\
       Go to [about://extensions/][about_ext] and check **Developer Mode** checkbox.

### Download and Install

1. Download the extension here : [download][download], and extract it.\
   You can also go to the [release page][release] to check out other versions.
2. Go to chrome extensions page : [about://extensions/][about_ext]
3. You will see a button called **Load Unpacked Extension...** click that
4. Select the extracted folder and click **Open**

**Note:** If you downloaded the SourceCode, you can also install it by running the following command in your terminal (You will need Node.JS and npm installed on your machine) :

``` shell
npm install
npm run build
```

This will build the extension in `build` folder. Then you can manually install the extension.

### Customizing the Extension

The extension comes with an options page from which you can customize the extension. You can find it in the extensions menu, just **Right Click** on the extension icon and click on **Extension Options**. You will have several options like...

Alternatively, you can open the options page by **double-clicking** on the extension icon in the toolbar.

- **Dark Mode:** to toggle the dark mode.\
  > Default: Enabled
- **Quality Settings:** to select the quality of the songs you want to download.\
  > Default: 160kbps
- **Name Format**: to change the name of the songs in a specified format.\
  > Default: $title - $album_artist,\
  > Params: $title, $album_artist, $artists, $album, $year, $track, $genre, $bitrate
- **Update Notification**: to enable or disable the update notification.\
  > Default: Enabled

## Credits

I must acknowledge where credit is due. This project would not be possible without the help of the following people and their open-source projects.

- [naqushab / saavn-downloader-extension](https://github.com/naqushab/saavn-downloader-extension)\
  Gave the inspiration to build the extension.
- [Tehhs / chrome-localhost-cors-unblocker](https://github.com/Tehhs/chrome-localhost-cors-unblocker)\
  Helped to make the extension completely standalone, adn remove requirement of any proxy server.
- [monuyadav016 / Saavn-Downloader](https://github.com/monuyadav016/Saavn-Downloader)\
  Gave the concept of the JioSaavn API.

Their Projects help me a lot in developing this extension.

[&#x21e1; Back to top](#)

---

Made with 💖 in India.

[about_ext]: about://extensions/
[release]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases ' '
[download]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases/download/v22.2.26/release.zip 'Download'
[profile]: https://github.com/GrayGalaxy

<!--Images -->

[img_1]: https://user-images.githubusercontent.com/49820575/152336823-7ae2fa07-56a2-438e-9ff3-46a1d69566c6.jpg

<!-- Shields -->

[sh_gh_stars]: https://img.shields.io/github/stars/GrayGalaxy/jiosaavn-downloader?logo=github&label=Stars
[sh_chrome]: https://img.shields.io/badge/-Chrome-black?logo=google-chrome&logoColor=white
[sh_version]: https://img.shields.io/github/v/release/GrayGalaxy/jiosaavn-downloader?include_prereleases&label=Version
[sh_downloads]: https://img.shields.io/github/downloads/GrayGalaxy/jiosaavn-downloader/total?label=Downloads
