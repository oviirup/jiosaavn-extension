# JioSaavn Downloader

Simple and effective extension to download Songs, Albums or Plylist from jiosaavn.com with just one click. It also hides ads and promotions from JioSaavn Web, and slightly tweaks the UI.

:star: If you love the extension. [![GitHub stars](https://img.shields.io/github/stars/GrayGalaxy/JioSaavn-Downloader.svg?style=flat&logo=github&label=Star)](https://github.com/GrayGalaxy/JioSaavn-Downloader)

:smile: Follow me if you want to be updated. [![GitHub followers](https://img.shields.io/github/followers/GrayGalaxy.svg?style=flat&logo=github&label=Followers)](https://github.com/GrayGalaxy)

## Screenshots

![Song Quality Selector](https://i.ibb.co/XWfJZGZ/1.jpg)

![Single Song Download](https://i.ibb.co/Mpvp4tw/2.jpg)



## How It Works

It uses somewhat modified version of [JioSaavn API](https://github.com/cachecleanerjeet/JiosaavnAPI) developed by [cachecleanerjeet](https://github.com/cachecleanerjeet) to fetch Songs Data.

It pulls data of selected song from official servers within the extension itself. It dows not require external API endpoints.

<small>Previously This extension used JioSaavn API in the backend to fetch Download Links in real time.</small>

After Fetching data it gives out MP3 file with neatly organized tags and album art with the help of `ID3.js`

## Features

- Select Any Quality Downloads (Supports HD 320kbps)
- Download a Single Song
- Download complete Album as zip
- Download a Playlist of your choice
- Blocks ADs and Promotions
- Modifies some of the UI Elements.

## How to use It

- Select preferred quality,
- To Download a Single Song: Click the download button on the right of the title of the song.
- To Download an Album: Click the download button right next to play button in album title.

## How to Install it

This extension cannot hosted be in chrome webstore due to obvious reasons. You can manually install the extension just by following the steps...

- Download the extension here : [download](https://github.com/GrayGalaxy/JioSaavn-Downloader/releases)
- Extract the zip file
- Go to chrome extensions page : [about://extensions/](about://extensions/)
- You will see a button called **Load Unpacked Extension...** click that
- Select the extracted folder and click **Open**

  <small>
  Note: <strong>Developer mode</strong> is required to enable the extension. You can see a toggle button promptly named "Developer Mode". Turn it on to enable the Developer mode.

  You might get turn off developer mode notification every time you open the browser if you are using Stable versions of chrome. You can use Chrome Dev or Canary of that notification annoys you.
  </small>


## Behind the Scenes

### Overview

The extension just fetches data from the JioSaavn server for necessary links to download the songs. It doesn't rely on any external or 3rd party services to fetch data, it does all the work in browser.

There is a [JioSaavn API](https://github.com/cachecleanerjeet/JiosaavnAPI) developed by [cachecleanerjeet](https://github.com/cachecleanerjeet) and fetching Songs Data via that API and then downloading it in Browser and adding perfect metadata in it.

Make sure you check out JioSaavn API page and the original extension repo and :star: it if you like. People do not earn anything from this and spend their precious time developing it and release it for free. A small praise, a good mention makes them feel good and it doesn't cost anything. See right sidebar for the list of contributors to the repo.

### Dependencies
- [JQuery](https://github.com/jquery/jquery) - To simplify code
- [ID3 JS](https://github.com/aadsm/JavaScript-ID3-Reader) - To add tags to downloaded files
- [JS Zip](https://github.com/Stuk/jszip) - To create zip file for Playlists or Albums

### How it works

### - Song
- When you press a download button on song it fetches data of song from the JioSaavn server to provide Links, Title, Album etc.
- Then it will send a request to this [custom API endpoint](corsdisabledsong.tuhinwin.workers.dev) and generate a download URL from server.
- Then it will download the song asynchronously in background. as the download song will have a gibberish name and no song details.
- Then it will download the album art asynchronously.
- Finally it will add ID3 tags (Title, Singer, Cover, Composer and stuff) to the downloaded song.

### - Album, Playlist
- On clicking the Download button it fetches lists of songs from server to donwload.
- Then it downloads the songs one by one as mentionsed above.
- We will make a virtual zip on memory and create a folder and add the songs there.
- Finally you can Download the Zip file.
___
Made with :heart: in India.
