# FoodRadar

A Node.js package that tries to gather data from multiple food delivery apps via a simple API.

### Why the hell ?

Where I live, there's at least 6 different food delivery apps I know of and I think that opening 6 different apps to see which restaurants can be delivered around you is kinda annoying.

So I was thinking "ah, someone must have made a tool to list all restaurants from various apps", but I couldn't find any.

I then decided to see if it was even possible. It seems like it is.

### Limitations ?

Yes, **many** !

This is just a WIP proof-of-concept, can not be used in production.

It only supports **Deliveroo** and **Foodora** right now.

Foodora only works in France, because they use different APIs depending on the country and I haven't been looking for the others yet.

I looked at **UberEats** too, but I think they are using [SSL pinning](https://en.wikipedia.org/wiki/HTTP_Public_Key_Pinning) which makes it difficult for me to use a [MITM attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) to sniff the requests out of the app.

### Will you ever finish this ?

Maybe, maybe not. I don't have a lot of free time to work on things like this unfortunately. I do believe however that this "too many apps for freaking food delivery" issue should be tackled.

### Example ?

```js
// Set address using Google's Geocoding (API limit is low without a valid API key)
let radar = new FoodRadar("40 avenue d'Italie - 75013 Paris")

// Set the coordinates directly
let radar = new FoodRadar({lat: 48.856614, lon: 2.352222})

// Use the getRestaurants() method to get a list of restaurants near the address passed to the constructor
radar.getRestaurants().then(restaurants => {
	console.log(restaurants)
})
```

If you're lucky, you'll get an object that'll look like this:

![foodradar-output](https://i.imgur.com/jhEpw5F.png)