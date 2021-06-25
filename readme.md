# JioSaavn Downloader Chrome Extension <br> [![GitHub stars][sh_gh_stars]][star] [![][sh_release1]][release] [![][sh_release2]][release]

Simple and effective extension to download Songs, Albums or Playlist from JioSaavn.com with just one click. It also hides ads and promotions from JioSaavn Web, and slightly tweaks the UI.

Give it a star if you love the extension.\
[Follow][profile] me if you want to get updates of my repos.

You can download the extension form the following [link][download].\
You can go to the [_Changelogs_][changelog] to have a look at the upcoming features
<small>You can also go through how to install it if you are struggling.</small>

## Screenshots

![Song Quality Selector](https://i.ibb.co/XWfJZGZ/1.jpg)

![Single Song Download](https://i.ibb.co/444dJB0/1.jpg)

## How It Works

It fetches data from the api endpoints of JioSaavn, organizes them in useful manner. All this happens within the browser and does not rely on external servers.

<small>Previously This extension used <a href='https://github.com/cachecleanerjeet/JiosaavnAPI'>JioSaavn API</a> in the backend to fetch Download Links in real time.</small>

After Fetching data it gives out MP3 file with neatly organized tags and album art with the help of `ID3.js`

## Features

- Select Any Quality Downloads (Supports HD 320kbps)
- Download a Single Song
- Download Album, Playlist as zip
- Blocks ADs and Promotions
- Modifies some of the UI Elements.

<small>For upcoming features you can refer to [Changelog](https://github.com/GrayGalaxy/jiosaavn-downloader/blob/beta/changelog.md)</small>

## How to use It

- Select preferred quality,
- To Download a Single Song: Click the download button on the right of the title of the song.
- To Download an Album: Click the download button right next to play button in album title.

## How to Install it

This extension cannot hosted be in Chrome webstore due to obvious reasons. You can manually install the extension just by following the steps...

- Download the extension here : [download][download]
- Extract the zip file
- Go to chrome extensions page : [about://extensions/](about://extensions/ " ")
- You will see a button called **Load Unpacked Extension...** click that
- Select the extracted folder and click **Open**\
  <small>
  Note: <strong>Developer mode</strong> is required to enable the extension. You can see a toggle button promptly named "Developer Mode". Turn it on to enable the Developer mode.<br>
  You might get turn off developer mode notification every time you open the browser if you are using Stable versions of chrome. You can use Chrome Dev or Canary of that notification annoys you.
  </small>

## Behind the Scenes

The extension just fetches data from the JioSaavn server for necessary links to download the songs. Then it grabs the song in mp3 format from the backend services.

Make sure you check out [JioSaavn API][a1] and [Jiosaavn Downloader Extension][a2] repo and :star: it if you like. People do not earn a penny from this and spend their precious time developing it and release it for free. A small praise, a good mention makes them feel good and it doesn't cost anything. See right sidebar for the list of contributors to the repo.

### Dependencies

- [JQuery][d1] - To simplify code
- [ID3 JS][d2] - To add tags to downloaded files
- [JS Zip][d3] - To create zip file for Playlists or Albums

### How it works

#### Song

- When you press a download button on song it fetches data of song from the JioSaavn server to provide Links, Title, Album etc.
- Then it will send a request to this [custom API endpoint][a3] and generate a download URL from server.\
  <small>This helps to avoid CORS errors if we try to fetch from browser</small>
- Then it will download the song asynchronously in background. as the download song will have a gibberish name and no song details.
- Then it will download the album art asynchronously.
- Finally it will add ID3 tags (Title, Singer, Cover, Composer and stuff) to the downloaded song.

#### Album, Playlist

- On clicking the Download button it fetches lists of songs from server to download.
- Then it downloads the songs one by one as mentioned above.
- For playlists it also downloads the featured image if available.
- We will make a virtual zip on memory and create a folder and add the songs there.
- Finally you can Download the Zip file.

## Help me solve Issues

[![][sh_issues_open]][issues]
[![][sh_issues_closed]][issues]

If you have some suggestions or you ran into some problems you can post it to the [issues tab][issues]. It is not always possible to find out all the issues alone, and overtime there might be new issues that was previously undetected.\
<small>Make sure to read other issues also before posting a new issue. One of might relate to your problem</small>

---

Made with :heart: in India.

[star]: https://github.com/GrayGalaxy/jiosaavn-downloader "Star it"
[release]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases " "
[download]: https://github.com/GrayGalaxy/jiosaavn-downloader/releases/download/v0.7.3/release.zip "Download"
[changelog]: https://github.com/GrayGalaxy/jiosaavn-downloader/blob/beta/changelog.md
[issues]: https://github.com/GrayGalaxy/jiosaavn-downloader/issues " "
[profile]: https://github.com/GrayGalaxy
[a1]: https://github.com/cachecleanerjeet/JiosaavnAPI "By @cachecleanerjeet"
[a2]: https://github.com/naqushab/saavn-downloader-extension "By @naqushab"
[a3]: https://jiosaavnex.vercel.app/
[d1]: https://github.com/jquery/jquery
[d2]: https://github.com/aadsm/JavaScript-ID3-Reader
[d3]: https://github.com/Stuk/jszip

<!-- Shields -->

[sh_gh_stars]: https://img.shields.io/github/stars/GrayGalaxy/jiosaavn-downloader.svg?style=flat-square&logo=github&label=Stars
[sh_release1]: https://img.shields.io/github/v/tag/graygalaxy/jiosaavn-downloader?include_prereleases&style=flat-square&label=Latest
[sh_release2]: https://img.shields.io/github/downloads/GrayGalaxy/jiosaavn-downloader/total?style=flat-square&label=Downloads
[sh_issues_open]: https://img.shields.io/github/issues-raw/GrayGalaxy/jiosaavn-downloader?style=flat-square&label=Open
[sh_issues_closed]: https://img.shields.io/github/issues-closed-raw/GrayGalaxy/jiosaavn-downloader?style=flat-square&label=Closed
