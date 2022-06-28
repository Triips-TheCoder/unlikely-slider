import Dom  from "./dom";

/**
 * @class
 * @classdesc Permet de prendre une string et de placer chaque lettres ou chaque mots dans une span.
 */
export class Splitter
{
	/**
	 * Place du texte dans une span.
	 * @param { String } text lettre ou mot qui sera placé dans une span.
 	 * @private
	 */
	private static span(text: string)
	{
		const spanNode = document.createElement('span')
		spanNode.textContent = text
		return spanNode
	}

	/**
	 * Decoupe du texte par lettre
	 * @param { String } text un texte qui se trouve dans un Tag
	 * @private
	 */
	private byLetter(text: string)
	{
		return [...Array.from(text)].map(Splitter.span.bind(this))
	}

	/**
	 * Decoupe du texte par mot
	 * @param { String } text un texte qui se trouve dans un Tag
	 * @private
	 */
	private byWord(text: string)
	{
		return text.split(/(\s+)/).map(Splitter.span.bind(this))
	}

	/**
	 * Choisis comment découper le texte.
	 * @param { String | HTMLElement } node le texte du node a découper.
	 * @param { String } attribute paramètre qui permet de spécifier de quel manière la classes doit découper le texte.
	 */
	public splitNode<T extends string | HTMLElement>(node: T, attribute: string)
	{
		const splitElement = Dom.checkValidNode(node) as HTMLElement
		const splitElementText = Dom.textExtractor(splitElement)

		let newSpanNodes: HTMLSpanElement[]
		const isLetter = attribute.includes('letter')
		const isWord = attribute.includes('word')

		if (isLetter)
		{
			newSpanNodes = this.byLetter(splitElementText)
			splitElement!.firstChild!.replaceWith(...newSpanNodes)
		}
		if (isWord)
		{
			newSpanNodes = this.byWord(splitElementText)
			splitElement!.firstChild!.replaceWith(...newSpanNodes)
		}
	}
}