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

	getDeliveroo(){
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
							isOpen: v.open
						}
					})
				resolve(deliRestaurants)
			})
			.catch(() => {
				reject()
			})
		})
	}

	getFoodora(){
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
							isOpen: v.is_active
						}
					})
				resolve(foodRestaurants)
			})
			.catch(() => {
				reject()
			})
		})
	}

	async getRestaurants(){
		if ( !this.lat || !this.lon )
			await this.setAddress(this.address)

		let promises = []

		return new Promise((resolve, reject) => {

			promises[0] = this.getDeliveroo()
			promises[1] = this.getFoodora()

			Promise.all(promises).then((restaurants) => {
				resolve(restaurants)
			})

		})

	}
}