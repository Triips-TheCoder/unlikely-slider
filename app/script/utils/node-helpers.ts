/**
 * @class
 * @clasdesc contient un ensemble de fonction utilitaire pour les éléments du DOM.
 */
export class nodeHelpers
{
	/**
	 * Permet de vérifier si un objet contient une propriété ou non.
	 * @param { Object } obj L'objet à vérifier
	 * @param { PropertyKey } prop Propriété d'un objet.
	 * @return { boolean }
	 */
	public static hasProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>
	{
		return obj.hasOwnProperty(prop)
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

	/**
	 * Permet d'extraire le texte d'un node.
	 * @param { HTMLElement } splitElement Le node
	 * @return { string } Le texte du node
	 */
	public static textExtractor(splitElement: HTMLElement)
	{
		return splitElement.textContent!.replace(/\s+/g, ' ').trim()
	}
}