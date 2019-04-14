let glob = require('glob')
let express = require('express');
let app = express();
let fs = require('fs')
let port = 5050

svgToDataURL = svgStr => {
	const encoded = encodeURIComponent(svgStr)
		.replace(/'/g, '%27')
		.replace(/"/g, '%22')

	const header = 'data:image/svg+xml,'
	const dataUrl = header + encoded

	return dataUrl
}

glob(`./icons9-frontend/dist/svgs/**/*.svg`, null, async function (er, files) {
	let based = []
	files.forEach(file => {
		let data = fs.readFileSync(file)
    let path = file.replace('./icons9-frontend/dist/','')
    let prefix = file.startsWith('brands') ? 'fab' : 'fas'
    let name = path.substring(path.lastIndexOf('/')+1).replace('.svg','')
		based.push({
			encoded: svgToDataURL(data.toString()),
			image: data.toString(),
			path: path,
      prefix: prefix,
      name: name,
      fullName: `${prefix} fa-${name}`
		})
	})

	fs.writeFile('./library.json', JSON.stringify(based), function (err) {
		if (err) {
			console.log('Error writing library to file')
		}
		console.log('\x1b[36m%s\x1b[0m',`Library is now ready to be served`)
	});
})

app.use('/', express.static('icons9-frontend/dist'))
app.get('/api/library', function (req, res) {
	fs.readFile('./library.json', 'utf-8', function(err, buf) {
		res.send(buf.toString());
	});
})

console.log(`Servering on: http://localhost:${port}`)
app.listen(port)
