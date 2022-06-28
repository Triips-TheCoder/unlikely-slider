//const _childNodes = new WeakMap()
//const _animData = new WeakMap()
//const _animDelay = new WeakMap()
//const _callReverse = new WeakMap()
import Dom from "../utils/dom";

/**
 * @class
 * @classdesc Permet de créer des animations basé sur la WebAnimationAPI
 */
export class Rosa
{
	/**
	 * Permet de mettre un délai avant le lancement d'une autre animation
	 * @param { number } n Le temps en ms avant que la promesse soit retourner
	 * @return { Promise } Une promesse qui représente un setTimeout
	 */
	static debounce(n: number)
	{
		return new Promise((resolve) => setTimeout(resolve, n))
	}

	/**
	 * Permet de créer des animations stagger du premier au dernier childNodes d'un élément parentNode
	 * @static
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	static async stagger<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]
		const delay = options!.delay!
		let count = 0
		const keyframesArr = keyframes as Keyframe
		let animProperties: string

		if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "transform, opacity"
		else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			animProperties = "transform"
		else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "opacity"

		for (let i = 0; i < childNodes.length; i++) {
			const node = childNodes[i] as HTMLElement

			if (node.textContent === " ") {
				const nextNodes = childNodes[i + 1] as HTMLElement
				nextNodes.style.willChange = animProperties!
				options!.delay = delay * count
				nextNodes.animate(keyframes, options).onfinish = () => nextNodes.style.willChange = "auto"
			} else {
				node.style.willChange = animProperties!
				options!.delay = delay * count
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
				count++
			}
		}

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}

	/**
	 * Permet de créer des animations du dernier au premier childNodes d'un élément parentNode
	 * @static
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	 static async staggerReverse<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]
		const delay = options!.delay!
		let count = 0
		const keyframesArr = keyframes as Keyframe
		let animProperties: string

		if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "transform, opacity"
		else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			animProperties = "transform"
		else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "opacity"

		childNodes.reverse()

		for (let i = 0; i < childNodes.length; i++) {
			const node = childNodes[i] as HTMLElement

			if (node.textContent === " ") {
				const nextNodes = childNodes[i + 1] as HTMLElement
				nextNodes.style.willChange = animProperties!
				options!.delay = delay * count
				nextNodes.animate(keyframes, options).onfinish = () => nextNodes.style.willChange = "auto"
			} else {
				node.style.willChange = animProperties!
				options!.delay = delay * count
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
				count++
			}
		}

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}

	/**
	 * Permet de créer une animation simple avec la webAnimationAPI
	 * @static
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	 static async basic<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		Dom.checkValidNode(node as HTMLElement)!.animate(keyframes, options)

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}

	/**
	 * Permet de créer des animations avec des délais aléatoire sur les childNodes d'un élément parentNode
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	static async random<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]
		const delay = options!.delay!
		const keyframesArr = keyframes as Keyframe
		let animProperties: string

		if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "transform, opacity"
		else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			animProperties = "transform"
		else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "opacity"

		for (let i = 0; i < childNodes.length; i++) {
			const node = childNodes[i] as HTMLElement

			if (node.textContent === " ") {}
			else {
				node.style.willChange = animProperties!
				options!.delay = Math.round(Math.random() * childNodes.length * delay)
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			}
		}

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}

	/**
	 * Permet de créer des animation qui donne un certain délai aux childNodes pairs et un autre délai aux childNodes impairs d'un élément parentNode
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	 static async oneTwo<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]

		const delay = options!.delay!

		const keyframesArr = keyframes as Keyframe
		let animProperties: string

		if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			 animProperties = "transform, opacity"
		else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			 animProperties = "transform"
		else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			 animProperties = "opacity"

		 //_animDelay.set(this, delay)

		for (let i = 0; i < childNodes.length; i++) {
			const node = childNodes[i] as HTMLElement

			if (i % 2 === 0 && node.textContent !== " ") {
				node.style.willChange = animProperties!
				options!.delay = 0
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			} else if (i % 2 !== 0 && node.textContent !== " ") {
				node.style.willChange = animProperties!
				options!.delay = delay
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			}
		}

		if (nextCallDelay > 0) {
			await Rosa.debounce(nextCallDelay)
		}
	}

	/**
	 * Permet de créer des animation stagger qui donne un certain délai aux childNodes pairs et un autre délai aux childNodes impairs d'un élément parentNode
	 * @static
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	 static async oneTwoStagger<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]
		const delay = options!.delay!

		const keyframesArr = keyframes as Keyframe
		let animProperties: string

		if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "transform, opacity"
		else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			animProperties = "transform"
		else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "opacity"

		for (let i = 0; i < childNodes.length; i++) {
			const node = childNodes[i] as HTMLElement

			if (i % 2 === 0 && node.textContent !== " ") {
				node.style.willChange = animProperties!
				options!.delay = delay * i
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			} else if (i % 2 !== 0 && node.textContent !== " ") {
				node.style.willChange = animProperties!
				options!.delay = delay
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			}
		}

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}

	/**
	 * Permet de créer des animation stagger reverse qui donne un certain délai aux childNodes pairs et un autre délai aux childNodes impairs d'un élément parentNode
	 * @static
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	 static async oneTwoStaggerReverse<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]

		const delay = options!.delay!

		const keyframesArr = keyframes as Keyframe
		let animProperties: string

		if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "transform, opacity"
		else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			animProperties = "transform"
		else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			animProperties = "opacity"

		childNodes.reverse()

		for (let i = 0; i < childNodes.length; i++) {
			const node = childNodes[i] as HTMLElement

			if (i % 2 === 0 && node.textContent !== " ") {
				node.style.willChange = animProperties!
				options!.delay = delay * i
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			} else if (i % 2 !== 0 && node.textContent !== " ") {
				node.style.willChange = animProperties!
				options!.delay = delay
				node.animate(keyframes, options).onfinish = () => node.style.willChange = "auto"
			}
		}

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}

	/**
	 * Permet de créer une animation en forme de V sur du texte
	 * @static
	 * @param { HTMLElement | string } node Le node qui doit être animé
	 * @param { Keyframe[] | PropertyIndexedKeyframes} keyframes L'animation a effectué
	 * @param { KeyframeAnimationOptions | undefined } options Les options de l'animation
	 * @param { number } nextCallDelay Permet de définir un délai d'attente avant qu'une autre animation se lance
	 */
	 static async vShape<T extends string | HTMLElement>(
		node: T,
		keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
		options: KeyframeAnimationOptions | undefined,
		nextCallDelay: number = 0
	) {
		let pointerA: number
		let pointerB: number
		let count: number = 0

		const selectedNode = Dom.checkValidNode(node) as HTMLElement
		const childNodes: Element[] = [...Array.from(selectedNode.children)]

		const delay = options!.delay!
		 const keyframesArr = keyframes as Keyframe
		 let animProperties: string

		 if (Dom.hasProperty(keyframesArr[0]!, 'transform') && Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			 animProperties = "transform, opacity"
		 else if (Dom.hasProperty(keyframesArr[0]!, 'transform'))
			 animProperties = "transform"
		 else if (Dom.hasProperty(keyframesArr[0]!, 'opacity'))
			 animProperties = "opacity"

		if (childNodes.length % 2 === 0) {
			pointerA = Math.floor(childNodes.length / 2) - 1
			pointerB = Math.floor(childNodes.length / 2)

			while (pointerB !== childNodes.length) {
				const nodeA = childNodes[pointerA] as HTMLElement
				const nodeB = childNodes[pointerB] as HTMLElement

				if (nodeA.textContent !== " ") {
					nodeA.style.willChange = animProperties!
					options!.delay = delay * count
					nodeA.animate(keyframes, options).onfinish = () => nodeA.style.willChange = "auto"
					count++
				} else {
					const nextNodeA = childNodes[pointerA - 1] as HTMLElement
					nextNodeA.style.willChange = animProperties!
					options!.delay = delay * count
					nextNodeA.animate(keyframes, options).onfinish = () => nextNodeA.style.willChange = "auto"
				}

				if (nodeB.textContent !== " ") {
					nodeB.style.willChange = animProperties!
					options!.delay = delay * count
					nodeB.animate(keyframes, options).onfinish = () => nodeB.style.willChange = "auto"
					count++
				} else {
					const nextNodeB = childNodes[pointerA - 1] as HTMLElement
					nextNodeB.style.willChange = animProperties!
					options!.delay = delay * count
					nextNodeB.animate(keyframes, options).onfinish = () => nextNodeB.style.willChange = "auto"
				}

				pointerA--
				pointerB++
			}
		} else {
			pointerA = pointerB = Math.floor(childNodes.length / 2)

			while (pointerB !== childNodes.length) {
				const nodeA = childNodes[pointerA] as HTMLElement
				const nodeB = childNodes[pointerB] as HTMLElement

				if (nodeA.textContent !== " ") {
					nodeA.style.willChange = animProperties!
					options!.delay = delay * count
					nodeA.animate(keyframes, options).onfinish = () => nodeA.style.willChange = "auto"
					count++
				} else {
					const nextNodeA = childNodes[pointerA - 1] as HTMLElement
					nextNodeA.style.willChange = animProperties!
					options!.delay = delay * count
					nextNodeA.animate(keyframes, options).onfinish = () => nextNodeA.style.willChange = "auto"
				}

				if (nodeB.textContent !== " ") {
					nodeB.style.willChange = animProperties!
					options!.delay = delay * count
					nodeB.animate(keyframes, options).onfinish = () => nodeB.style.willChange = "auto"
					count++
				} else {
					const nextNodeB = childNodes[pointerA - 1] as HTMLElement
					nextNodeB.style.willChange = animProperties!
					options!.delay = delay * count
					nextNodeB.animate(keyframes, options).onfinish = () => nextNodeB.style.willChange = "auto"
				}

				pointerA--
				pointerB++
			}
		}

		if (nextCallDelay > 0)
			await Rosa.debounce(nextCallDelay)
	}
}