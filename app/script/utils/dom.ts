/**
 * @class
 * @classdesc contient un ensemble de fonction utilitaire pour les éléments du DOM.
 */
export default class Dom {
	/**
	 * Permet de vérifier si un objet contient une propriété ou non.
	 * @param { Object } obj L'objet à vérifier
	 * @param { PropertyKey } prop Propriété d'un objet.
	 * @return { boolean }
	 */
	public static hasProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
		return obj.hasOwnProperty(prop)
	}

	/**
	 * Vérifie à partir d'un selecteur css, un id, ou un élément HTML si le node existe bien sur le page.
	 * @param { HTMLElement | String } node Node a vérifier.
	 * @param { boolean } all Un booléen qui indique si il y a plusieurs nodes à sélectionner
	 * @return { HTMLElement | Error }
	 */
	static getNode(node: HTMLElement | string, all: boolean = false): HTMLElement | HTMLElement[] {
		if (document.body.contains(typeof node === "string" ? document.querySelector(`${node}`) : node)) {
			if (all)
				return [...Array.from(document.querySelectorAll(`${node}`))] as HTMLElement[]
			else
				return typeof node === 'string' ? document.querySelector(`${node}`) ! as HTMLElement : node! as HTMLElement
		} else
			throw new Error("L'élement selectionné est invalide verifié si le selecteur est correct")
	}

	/**
	 * Permet d'extraire le texte d'un node.
	 * @param { HTMLElement } splitElement Le node
	 * @return { string } Le texte du node
	 */
	static textExtractor(splitElement: HTMLElement) {
		return splitElement.textContent!.replace(/\s+/g, ' ').trim()
	}


	/**
	 * Vérifie à partir d'un selecteur css, un id, ou un élément HTML si le node existe bien sur le page.
	 * @param { HTMLElement | String } node Node a vérifier.
	 * @return { (HTMLElement | Error)
	 */
	public static checkValidNode(node: HTMLElement | string): HTMLElement
	{
		if(document.body.contains(typeof node === "string" ? document.querySelector(`${node}`) : node))
			return typeof node === 'string' ? document.querySelector(`${node}`)! : node!
		else
			throw new Error("L'élement selectionné est invalide verifier si le selecteur est correct")
	}


	static addCssClass(el: HTMLElement, cssClass: string | string[]) {
		if (typeof cssClass === "string")
			el.classList.add(cssClass)
		else if (Array.isArray(cssClass))
			el.classList.add(...cssClass)
	}

	static removeCssClass(el: HTMLElement, cssClass: string | string[]) {
		if (typeof cssClass === "string")
			el.classList.remove(cssClass)
		else if (Array.isArray(cssClass))
			el.classList.remove(...cssClass)
	}

	static toggleCssClass(el: HTMLElement, cssClass: string) {
		el.classList.toggle(cssClass)
	}

	static contains(el: HTMLElement, cssClass: string) {
		return el.classList.contains(cssClass)
	}

	static initListener(el: HTMLElement, listenerType: string, callback: (e: any) => any) {
		el.addEventListener(`${listenerType}`, callback)
	}

	static cleanListener(el: HTMLElement | Window | Document, listenerType: string, callback: (e: any) => any) {
		el.removeEventListener(`${listenerType}`, callback)
	}

	static getCssClass(el: HTMLElement) {
		return Array.from(el.classList)
	}

	static getId(el: HTMLElement) {
		return el.id
	}

	static updateClass(el: HTMLDivElement, classToDelete: string, newClass: string) {
		Dom.removeCssClass(el, classToDelete)
		Dom.addCssClass(el, newClass)
	}

	static cleanClass(el: HTMLDivElement) {
		el.setAttribute('class', '')
	}
	static setStyle(el: HTMLElement, property: string, value: string) {
		// @ts-ignore
		el.style[property] = `${value}`
	}

	static setStyles(el: HTMLElement, properties: string[], values: string[]) {
		// @ts-ignore
		properties.forEach((property :string, index: number) => el.style[property] = `${values[index]}`)
	}

}
