# Rotero.js

## SPA hash routing for single page Vanilla.js app

___

### Route handling

```js
	import rotero from "rotero";

	const router = rotero();

	//handling '/' route
	router.on("/", (req, res) => {
		res.send("Home Page");
	});

    //must run the router to start
	router.run();
```

### Use with other router

```js
	const router = rotero();
	const router_page = rotero();

	// '/'
	router.on("/", (req, res) => {
			res.send("<h1>Home</h1>");
	});

	router_page.on("/about", (req, res) => {
		res.send("<h1>About</h1>")
	});

	//This will bind '/about' to '/page/about'
	router.use("/page", router_page);

	router.run();
```

### Styling

```js
	router.on("/", (req, res) => {
			res.send("<h1>Home</h1>");
			//applies style to the current page in the route
			res.style = `h1 {
				color : blue;
			}`;
	});
```

### Redirecting

```js
	router.on("/", (req, res) => {
		//Redirects to '/auth'
		res.goto("/auth");
	});
```

### Default route | 404

```js
    router.on("*", (req, res) => {
        console.error("Page not found");
    })
```

___

## _Note_ : **The routes are not regex but absolute to hash except for '*'**

It is express like implementation of single page application with hash routing
___
