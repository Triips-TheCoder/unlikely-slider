import { Menu } from "./menu";

interface headerBtn {
	el: HTMLButtonElement
	active: boolean
}

export class Header
{
	menu: Menu
	headerBtn: headerBtn
	logoWhite: HTMLSpanElement
	logoBlack: HTMLSpanElement
	headerBtnBlackLines: HTMLDivElement[]
	headerBtnWhiteLines: HTMLDivElement[]

	constructor() {
		this.headerBtn = {
			el : document.querySelector('.header__btn') as HTMLButtonElement,
			active : false
		}
		this.logoWhite = document.querySelector('.header__logo--white') as HTMLSpanElement
		this.logoBlack = document.querySelector('.header__logo--black') as HTMLSpanElement
		this.headerBtnBlackLines = [...Array.from(document.querySelectorAll('.header__line--black'))] as HTMLDivElement[]
		this.headerBtnWhiteLines = [...Array.from(document.querySelectorAll('.header__line--white'))] as HTMLDivElement[]
 		this.menu = new Menu()
		this.headerBtnListeners()
	}

	/**
	 * Add event on menu button
	 */
	headerBtnListeners() {
		this.headerBtn.el.addEventListener('click', () => {
			//const target = e.target as HTMLButtonElement
			//target.classList.toggle('header__btn--black')
			this.menu.toggleNavClass()

			if (!this.headerBtn.active) {
				this.menu.isOpenAnimation()
			} else {
				console.log('out')
			}

			this.toggleLogoAndBtnColor()
		})
	}

	private toggleLogoAndBtnColor() {
		if (!this.headerBtn.active) {
			this.logoBlack.style.opacity = '1'
			this.logoWhite.style.opacity = '0'

			this.headerBtnBlackLines.forEach(line => line.style.opacity = '1')
			this.headerBtnWhiteLines.forEach(whiteLine => whiteLine.style.opacity = '0')

			this.headerBtn.active = true
		} else {
			this.logoBlack.style.opacity = '0'
			this.logoWhite.style.opacity = '1'

			this.headerBtnBlackLines.forEach(line => line.style.opacity = '0')
			this.headerBtnWhiteLines.forEach(whiteLine => whiteLine.style.opacity = '1')

			this.headerBtn.active = false
		}
	}
}