
import { detectWebP } from "./script/utils/detect-webp"

/**
 * Initializate all the javascript logic
 */
class App
{
	private static instance: App

	constructor(private supportWebP = true) {}

	/**
	 * Singleton Pattern
	 * @return App
	 */
	static getInstance() {
		if (App.instance)
			return this.instance
		else
			return this.instance = new App()
	}

	/**
	 * Init application logic
	 */
	public init() {
		// Check if user browsers support WebP
		(async () => {
			if (await detectWebP()) {
				document.documentElement.classList.add('webp')
			} else {
				this.supportWebP = false
				document.documentElement.classList.add('no-webp')
			}
			// Obtenir toutes les variables css qui contiennent un lien vers une image
		})()
	}
}

const app = App.getInstance()
app.init()

export {}