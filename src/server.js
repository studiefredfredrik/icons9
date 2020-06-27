let glob = require('glob')
let express = require('express');
let app = express();
let fs = require('fs')
let port = 5000 || process.env.PORT

svgToDataURL = svgStr => {
	const encoded = encodeURIComponent(svgStr)
		.replace(/'/g, '%27')
		.replace(/"/g, '%22')

	const header = 'data:image/svg+xml,'
	const dataUrl = header + encoded

	return dataUrl
}

glob(`./icons9-frontend/dist/svgs/fas/**/*.svg`, null, async function (er, files) {
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

	fs.writeFile('./library-fas.json', JSON.stringify(based), function (err) {
		if (err) {
			console.log('Error writing library to file')
		}
		console.log('\x1b[36m%s\x1b[0m',`Library-fas is now ready to be served`)
	});
})

glob(`./icons9-frontend/dist/svgs/mdi/**/*48px.svg`, null, async function (er, files) {
	let based = []
	files.forEach(file => {
		let data = fs.readFileSync(file)
		let path = file.replace('./icons9-frontend/dist/','')
		let prefix = file.startsWith('brands') ? 'fab' : 'fas'
		let name = 'mdi-' + path.substring(path.lastIndexOf('/')+1).replace('.svg','').replace('ic_','').replace('_48px','').replace(/_/g, '-')
		based.push({
			encoded: svgToDataURL(data.toString()),
			image: data.toString(),
			path: path,
			prefix: prefix,
			name: name,
			fullName: `${name}`
		})
	})

	fs.writeFile('./library-mdi.json', JSON.stringify(based), function (err) {
		if (err) {
			console.log('Error writing library to file')
		}
		console.log('\x1b[36m%s\x1b[0m',`Library-mdi is now ready to be served`)
	});
})

app.use('/', express.static('icons9-frontend/dist'))
app.get('/api/library-fas', function (req, res) {
	fs.readFile('./library-fas.json', 'utf-8', function(err, buf) {
		res.send(buf.toString());
	});
})
app.get('/api/library-mdi', function (req, res) {
	fs.readFile('./library-mdi.json', 'utf-8', function(err, buf) {
		res.send(buf.toString());
	});
})

console.log(`Servering on: http://localhost:${port}`)
app.listen(port)
