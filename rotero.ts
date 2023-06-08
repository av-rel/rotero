export type Request = {
	url	: string;
	path	: string;
	query	: URLSearchParams;
};
export type Response = {
	title : string;
	body  : string;
	style : string;
	send(body : string) : void;
	goto(route : string): void;
};
export type RouteHandler = (req : Request, res : Response) => void;
export type Routes =  Map<string, RouteHandler>;


function resolve_path(path : string) : string {
	let p : string = path
			.replaceAll("\\", "/")
			.split("/")
			.filter((path : string) => path.length)
			.join()
			.replaceAll(",", "/");

	return "/" + p;
}

function resolve_query(path : string) : URLSearchParams {
	let q = path.substring(path.indexOf("?"));
	return new URLSearchParams(q);
}

function default_route(req : Request, res : Response) {
	res.title = "404 | Not Found";
	res.body = `
	<h1>Page ${req.path}</h1>
	<h1>404 not found</h1>
`;
	res.style = `* {
    box-sizing: border-box;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	text-align: center;
}
`;
	console.error(`GET ${req.path} 404 (Page not found)`);
}

function route_manager(root : HTMLElement, routes : Routes) : void {
	let path  : string = resolve_path(window.location.hash.substring(1).split("?")[0]);
	let query : URLSearchParams = resolve_query(window.location.hash);

	let req : Request = {
		url   : window.location.href,
		path,
		query,
	} as Request;
	let res : Response = {
		body : "",
		send : function(body : string)  : void {res.body += body},
		goto : function(route : string) : void {
			const url = new URL(window.location.href);
			url.hash = resolve_path(route);
			window.location.href = url.href;
		}
	} as Response;

	let handler : RouteHandler = routes.get(path) || default_route as RouteHandler;
	handler(req, res);

	if (res.title) document.title = res.title;
	if (res.style) res.body += `<style>${res.style}</style>`;

	root.innerHTML = res.body;
}

	
export class Router {
	private node : string;
	private root : HTMLElement;
	private routes : Routes;

	constructor(node : string = "#app") {
		this.node = node;
		this.routes = new Map();
	}

	public on(route: string, handler : RouteHandler) : void {
		this.routes.set(resolve_path(route), handler);
	}

	public use(route : string, router : Router) : void {
		router.routes.forEach((v : RouteHandler, k : string, _ : Routes) => this.routes.set(resolve_path(route + '/' + k), v));
	}

	public remove(route : string) : void {
		this.routes.delete(route);
	}

	public run() : void {
		let app : null | HTMLElement = document.querySelector(this.node);
		if (!app) {
			app = document.createElement("div");
			app.setAttribute("id", this.node);
			document.body.appendChild(app);
		}
		this.root = app;

		window.addEventListener("DOMContentLoaded", () : void => route_manager(this.root, this.routes))
		window.addEventListener('hashchange', () : void => route_manager(this.root, this.routes));
	}
}

export default function createRouter() {
	return new Router();
}
