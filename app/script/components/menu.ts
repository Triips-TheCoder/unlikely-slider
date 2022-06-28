import { Rosa } from "../animations/rosa"
import { ease } from "../animations/ease"
import { stagger } from "../animations/stagger";

const navLinesKF = [{ transform : 'translate3d(-100%, 0, 0)', opacity: '0'}, { transform : 'translate3d(0, 0, 0)', opacity: '1'}]
const navPagesLinksKF = [{ transform: 'translate3d(0, -125%, 0)', opacity: '0'}, { transform: 'translate3d(0, 0, 0)', opacity: '1'}]

export class Menu
{
	nav: HTMLElement
	navPagesLinks: HTMLLinkElement[]
	navLines: HTMLDivElement[]

	constructor(){
		this.nav = document.querySelector('.navigation') as HTMLElement
		this.navPagesLinks = [...Array.from(document.querySelectorAll('.page-link'))] as HTMLLinkElement[]
		this.navLines = [...Array.from(document.querySelectorAll('.navigation__line'))] as HTMLDivElement[]
	}

	/**
	 * Toggle classlist of nav element in the menu
	 */
	toggleNavClass() {
		this.nav.classList.toggle('navigation--is-open')
	}

	/**
	 * Make animation when menu is open
	 */
	isOpenAnimation() {
		this.navLines.forEach((line, index) => {
			Rosa.basic(line, navLinesKF, {
				fill: "forwards",
				easing: ease.inOut3,
				duration: 2000,
				delay: stagger.st3_f * index
			})
		})

		this.navPagesLinks.forEach((link, index) => {
			Rosa.basic(link, navPagesLinksKF, {
				fill: "forwards",
				easing: ease.slowFinal,
				duration: 2000,
				delay: 800 + stagger.st4_f * index
			})
		})
	}
}