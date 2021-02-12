# JioSaavn Song Downloader :musical_note:

:star: If you love the extension. [![GitHub stars](https://img.shields.io/github/stars/GrayGalaxy/JioSaavn-Song-Downloader.svg?style=flat&logo=github&label=Star)](https://github.com/GrayGalaxy/JioSaavn-Song-Downloader)

:smile: Follow me if you want to be updated. [![GitHub followers](https://img.shields.io/github/followers/GrayGalaxy.svg?style=flat&logo=github&label=Followers)](<(https://github.com/GrayGalaxy)>)

## Screenshots

![Song Quality Selector](https://i.ibb.co/KyH5D8M/02.png)
![Single Song Download](https://i.ibb.co/1shN3N3/Album-Download.png)

This Extension will allow you to download any song in JioSaavn seamlessly and easily. It also hides ads from JioSaavn Web.

## How It Works

This extension requires JioSaavn API in the backend to fetch Download Links in real time.

It uses [JioSaavn API](https://github.com/cachecleanerjeet/JiosaavnAPI) developed by [cachecleanerjeet](https://github.com/cachecleanerjeet) to fetch Songs Data.

After Fetching data it gives out MP3 file with neatly organised tags and album art with the help of `ID3.js`

## Features

- Select Any Quality Downloads (Supports HQ 320kbps)
- Download a Single Song
- Download an Album **(in progress)**
- Download a Playlist **(in progress)**
- Blocks ADs and Promotions
- Modifies some of the Elements.

## How to use It

- Select preferred quality,
- To Download a Single Song: Click the download button on the right of the title of the song.
- To Download an Album: Click the download button right next to play button in album title.

## How to Install it

This extension can not hosted be in chrome webstore due to obvious reasons. You can manually install the extention just by foloowing the steps...

- Download the extension here : [download](https://github.com/GrayGalaxy/JioSaavn-Downloader/releases)
- Extract the zip file
- Go to chrome extensions page : [about://extensions/](about://extensions/)
- You will see a button called "Load Unpacked Extension.." click that
- Select the extracted folder and press "OK"

<small>
Note: Developer mode is required to enable the extention. You can see a toggle button promptly named "Developer Mode". Turn it on to enable the Developer mode.

You miget get turn off developer mode notification every time you open the browser if you are using Stable versions of chrome. You can use Chrome Dev or Canary of that ntification anoys you.
</small>

# TODO
- [ ] Add Download button in Now Playing list
- [ ] Add

## Issues

- Album and Playlist downloads are currently not working

Please have a look at other issues before submitting a new one. If you have any issues regarding this extension whih you think is unique, you may submit a issue in here [issue link](https://github.com/naqushab/saavn-downloader-extension/issues/new)  
Please provide all the issue details in the template that is given for a quicker resolution.

## Behind the Scenes

### Overview

This extention was originally created by
[Naqushab Neyazee](https://github.com/naqushab) in this [repo](https://github.com/naqushab/saavn-downloader-extension).

There is a [JioSaavn API](https://github.com/cachecleanerjeet/JiosaavnAPI) developed by [cachecleanerjeet](https://github.com/cachecleanerjeet) and fetching Songs Data via that API and then downloading it in Browser and adding perfect metadata in it.

Make sure you check out JioSaavn API page and the original extention repo and :star: it if you like. People donot earn anything from this and spend their precious time developing it and release it for free. I am personally a huge fan of structural appraoch and like the repo a lot. A small praise, a good mention makes them feel a lot good and it doesn't cost anything. See right sidebar for the list of contributors to the repo.

### How it works

### - Song

- When you press a download button on song. it will send a request to this [custom API endpoint](corsdisabledsong.tuhinwin.workers.dev) and generate a download URL from server.
- Then it will download the song asynchronously in background. as the download song will have a gibberish name and no song details.
- Then we will download the album art asynchronously.
- Then we will add ID3 tags (Title, Singer, Cover, Composer and stuff) to the downloaded song.

#### - Album, Playlist <small>(not yet working. In progress)</small>

- Will download all Songs asynchronously as mentioned above.
- We will make a virtual zip on memory and create a folder and add the songs there.
- Download the Zip
- Somewhat Buggy
___
Made with :heart: in India.
