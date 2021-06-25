const axios = require('axios')
module.exports = (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Cache-Control', 'maxage=600, stale-while-revalidate')
	res.setHeader('Author', 'Avirup Ghosh https://github.com/GrayGalaxy/')
	// return axios
	const url = req.url.replace('/image', '')
	let src_url = `https://schnncdnems04.cdnsrv.jio.com/c.saavncdn.com/${url}`
	axios.get(src_url, { responseType: 'arraybuffer' })
		.then(r => r.data)
		.then(result => res.end(result))
		.catch(() => res.status(403).end('Cannot access the requested url'))
}