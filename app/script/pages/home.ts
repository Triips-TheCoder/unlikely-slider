import { Header } from "../components/header"

export class Home
{
	private static instance: Home

	constructor() {
		this.initHome()
	}

	/**
	 * Singleton Pattern
	 * @return Home
	 */
	static getInstance() {
		if (Home.instance)
			return this.instance
		else
			return this.instance = new Home()
	}

	initHome() {
		new Header()
	}
}

