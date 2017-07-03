import HTTP from './http'

const 	userAgent = "Deliveroo-OrderApp/2.18.0 (iPhone9,3; iOS10.3.2; Release; en_EN; 8365)",
		api = 'https://deliveroo.co.uk/orderapp/v1/'

let Deliveroo = class Deliveroo {

	constructor(){
		this.req = new HTTP('Deliveroo')
	}

	api(path){
		return `${api}${path}`
	}

	login( username, password ){
		let request = {
			method: 'POST',
			url: this.api('login'),
			body: {"client_type":"orderapp_ios"},
			json: true,
			headers: this.headers({ 'Content-Type': 'application/json' }),
			auth: {
				user: username,
				pass: password
			}
		}

		return this.req.request(request)
	}

	restaurants( lat = 48.828459, lon = 2.356061 ){
		lat = lat.toFixed(5),
		lon = lon.toFixed(5)

		let request = {
			method: 'GET',
			url: this.api(`restaurants?lat=${lat}&lng=${lon}`),
			headers: this.headers(),
		}

		return this.req.request(request)
	}

	restaurant( id, lat = 48.828459, lon = 2.356061 ){
		id = parseInt(id)
		lat = lat.toFixed(5)
		lon = lon.toFixed(5)

		let request = {
			method: 'GET',
			url: this.api(`restaurants/${id}?lat=${lat}&lng=${lon}`),
			headers: this.headers(),
		}

		return this.req.request(request)
	}

	headers( params = false ){
		let headers = {
			"Accept": "*/*",
			"Accept-Encoding": "gzip, deflate",
			"User-Agent": userAgent,
			"Connection": "keep-alive",
		}

		if (params)
			headers = Object.assign(headers, params)

		return headers
	}

}

Deliveroo = new Deliveroo()
export default Deliveroo