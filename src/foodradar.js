import Deliveroo from './deliveroo'
import Foodora from './foodora'
import Helpers from './helpers'
import Promise from 'bluebird'

export default class FoodRadar {
	constructor( address ){
		this.address = address
	}

	updateAddress(address){
		this.address = address
		this.lat = false
		this.lon = false
	}

	async setAddress(address){
		if ( typeof address == 'object' && address.lat && address.lon ){
			this.lat = address.lat
			this.lon = address.lon
			return true
		}else if(typeof address == 'string'){
			try{
				let geo = await Helpers.geocode(address)
				this.lat = geo[0].latitude
				this.lon = geo[0].longitude
				return true
			}catch(e){
				throw new Error(e)
			}
		}else{
			throw new Error("Invalid or empty address")
		}
	}

	getRestaurantsDeliveroo( raw = false ){
		return new Promise((resolve, reject) => {
			let deliRestaurants = []
			Deliveroo.restaurants(this.lat, this.lon)
			.then(r => {
				if (r.restaurants)
					deliRestaurants = r.restaurants.map(v => {
						return {
							app: 'deliveroo',
							id: v.id,
							name: v.name,
							budget: v.price_category,
							image: v.primary_image_url,
							coordinates: {
								lat: v.coordinates[0],
								lon: v.coordinates[1]
							},
							isNew: v.newly_added,
							deliveredIn: v.total_time,
							isOpen: v.open,
							raw: raw ? v : false
						}
					})
				resolve(deliRestaurants)
			})
			.catch(() => {
				reject()
			})
		})
	}

	getRestaurantsFoodora( raw = false ){
		return new Promise((resolve, reject) => {
			let foodRestaurants = []
			Foodora.restaurants(this.lat, this.lon)
			.then(r => {
				if (r.data.items)
					foodRestaurants = r.data.items.map(v => {
						return {
							app: 'foodora',
							id: v.id,
							name: v.name,
							budget: v.budget,
							image: `https://volo-images.s3.amazonaws.com/production/fr/${v.code}-listing.jpg`,
							coordinates: {
								lat: v.latitude,
								lon: v.longitude
							},
							isNew: v.is_new,
							deliveredIn: v.minimum_delivery_time,
							isOpen: v.is_active,
							raw: raw ? v : false
						}
					})
				resolve(foodRestaurants)
			})
			.catch(() => {
				reject()
			})
		})
	}

	async getRestaurants( raw = false ){
		if ( !this.lat || !this.lon )
			await this.setAddress(this.address)

		return new Promise((resolve, reject) => {

			let promises = []
			promises[0] = this.getRestaurantsDeliveroo(raw)
			promises[1] = this.getRestaurantsFoodora(raw)

			Promise.all(promises).then((restaurants) => {
				restaurants = [].concat.apply([], restaurants)
				resolve(restaurants)
			})

		})
	}

	getRestaurant( id, app = false, raw = false ){
		return new Promise((resolve, reject) => {

			let promises = []
			switch(app){
				case 'foodora':
					promises[0] = Foodora.restaurant( id )
					break
				case 'deliveroo':
					promises[1] = Deliveroo.restaurant( id, this.lat, this.lon )
					break
				default:
					promises[0] = Foodora.restaurant( id )
					promises[1] = Deliveroo.restaurant( id, this.lat, this.lon )
					break
			}

			Promise.all(promises).then((results) => {
				results = [].concat.apply([], results).filter(v => {
					if (v)
						if (v.id) return true
					return false
				})
				resolve(results)
			})

		})
	}

}