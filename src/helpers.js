import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import geocoder from 'node-geocoder'
import Promise from 'bluebird'

let Helpers = class Helpers{

	constructor(){
		this.geocoder = geocoder({
			provider: 'google'
		})
	}

	createFileIfNotExists(file, cb){
		if ( !fs.existsSync(file) ){
			mkdirp.sync(path.dirname(file))
			fs.writeFileSync(file, '', {flags: 'a+'})
		}
		cb()
	}

	geocode(address){
		return this.geocoder.geocode( address )
	}

	rgeocode(lat, lon){
		return this.geocoder.reverse({lat: lat, lon: lon})
	}

}

Helpers = new Helpers()
export default Helpers