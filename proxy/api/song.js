const axios = require('axios')
module.exports = (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Cache-Control', 'maxage=600, stale-while-revalidate')
	res.setHeader('Author', 'Avirup Ghosh https://github.com/GrayGalaxy/')
	// return axios
	const url = req.url.replace('/song', '')
	let src_url = `http://snoidcdnems06.cdnsrv.jio.com/h.saavncdn.com/${url}`
	console.log(src_url);
	axios.get(src_url, { responseType: 'arraybuffer' })
		.then(r => r.data)
		.then(result => res.send(result))
		.catch(() => res.status(403).end('Cannot access the requested url'))
}