import Req from 'Request'
import Helpers from './helpers'
import sanetize from 'sanitize-filename'
import FileCookieStore from 'tough-cookie-filestore'
import Promise from 'bluebird'

export default class HTTP{

	constructor(context){
		context = sanetize(context)
		let cookieFile = `./cookies/${context}.json`
		Helpers.createFileIfNotExists( cookieFile, () => {
			this.cookieFile = cookieFile
		})
	}

	request(options, context = false){
		options = this.attachDefaults(options)
		return new Promise((resolve, reject) => {

			Req(options, (error, response, body) => {
				if ( error )
					reject(error)
				else{
					if ( response.headers['content-type'].match(/json/i) ){
						body = JSON.parse(body)
						if (context) body.app = context
						resolve(body)
					}
					else
						resolve(body)
				}
			})
			
		})
	}

	attachDefaults(options){
		return Object.assign(options, {
			jar: Req.jar(new FileCookieStore( this.cookieFile )),
			gzip: true
		})
	}

	getParams(params){
		let r = []

		for (let k in params)
			r.push(`${k}=${encodeURIComponent(params[k])}`)

		return r.join('&')
	}

}