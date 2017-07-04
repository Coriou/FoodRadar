import HTTP from './http'

const 	userAgent = "foodora/8320",
		api = 'https://api.foodora.fr/api/v5/'

let Foodora = class Foodora {

	constructor(){
		this.req = new HTTP('Foodora')
	}

	api(path){
		return `${api}${path}`
	}

	restaurants( lat = 48.828459, lon = 2.356061 ){
		lat = lat.toFixed(5),
		lon = lon.toFixed(5)

		let request = {
			method: 'GET',
			url: this.api(`vendors?latitude=${lat}&longitude=${lon}`),
			headers: this.headers()
		}

		return this.req.request(request, 'foodora')
	}

	restaurant( id ){
		id = parseInt(id)

		let request = {
			method: 'GET',
			url: this.api(`vendors/${id}?include=cuisines,product_variations,metadata,schedules,payment_types,discounts`),
			headers: this.headers()
		}

		return this.req.request(request, 'foodora')
	}

	headers( params = false ){
		let headers = {
			"X-FP-API-KEY": "iphone",
			"Accept": "*/*",
			"Accept-Encoding": "gzip, deflate",
			"User-Agent": userAgent,
			"Connection": "keep-alive"
		}

		if (params)
			headers = Object.assign(headers, params)

		return headers
	}

}

Foodora = new Foodora()
export default Foodora