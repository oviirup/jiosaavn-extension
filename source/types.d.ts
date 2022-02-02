interface CommonSongsProps {
	id: string
	year: string
	label: string
	image: string
	album: string
}

export interface Song extends CommonSongsProps {
	track?: number
	url: string
	getURL: (bit: number) => string
	title: string
	artist: string[]
	album_artist: string[]
	genre: string
}

export interface List {
	title: string
	image: string
	songs: Song[]
}

export namespace ApiV3 {
	interface song extends CommonSongsProps {
		type: string
		song: string
		music: string
		primary_artists: string
		singers: string
		starring: string
		language: string
		'320kbps': string
		media_preview_url: string
		release_date: string
	}
	interface album {
		id: string
		title: string
		year: string
		songs: song[]
	}
	interface playlist {
		listid: string
		listname: string
		year: string
		songs: song[]
	}
}
