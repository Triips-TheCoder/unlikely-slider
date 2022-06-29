import styles from './styles.module.scss'
import renderingLoop from '../../script/renderingLoop'

class Slider {
    #state: number
    #numberOfSlide: number

    constructor() {
        this.#state = 0
        this.#numberOfSlide = 6
        this.#onMount()
    }

    public get state(): number {
        return this.#state
    }

    public render(): string {
        setTimeout(() => {
            this.#afterRender()
        }, 50)

        return `
          <button id='prev'>
            <svg width="64" height="63" viewBox="0 0 64 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.64533 31.5L25.7173 15.1331L24 13.125L-1.90735e-06 32.8676L24 52.5L25.72 50.4945L5.64266 34.125L64 34.125V31.5L5.64533 31.5Z" fill="white"/>
            </svg>
          </button>
          <button id='next'>
            <svg width="64" height="63" viewBox="0 0 64 63" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M58.3547 31.5L38.2827 47.8669L40 49.875L64 30.1324L40 10.5L38.28 12.5055L58.3573 28.875H0V31.5H58.3547Z" fill="white"/>
            </svg>
          </button>
          <div class=${ styles.test }>
            <div class=${ styles.container }>
               <div class=${ styles.slider } style='transform:translate3d(-${ 64 * (this.#state % this.#numberOfSlide) }rem, 0, 0)'>
                   <img src="images/slider-1.jpg" alt="photo d'une architecture moderne" class='${ styles.sliderImage }'/>
                   <img src="images/slider-2.jpg" alt="" class='${ styles.sliderImage }'/>
                   <img src="images/slider-3.jpg" alt="" class='${ styles.sliderImage }'/>
                   <img src="images/slider-4.jpg" alt="" class='${ styles.sliderImage }'/>
                   <img src="images/slider-5.jpg" alt="" class='${ styles.sliderImage }'/>
                   <img src="images/slider-6.jpg" alt="" class='${ styles.sliderImage }'/>
              </div>
              <p class=${ styles.total }>${ this.#isLastSlide() ? this.#numberOfSlide : (this.#state + 1) % this.#numberOfSlide } / 6</p>
            </div>
          </div>
        `
    }

    #onMount() {
        console.log('composant monté')
    }

    #onUnmount() {
        console.log('composé démonté')
    }

    #isLastSlide(): boolean {
        return this.#state % this.#numberOfSlide === this.#numberOfSlide - 1
    }

    #afterRender(): void {
        const nextBtn = document.querySelector('#next') as HTMLButtonElement
        const previousBtn = document.querySelector('#prev') as HTMLButtonElement

        nextBtn.onclick = () =>
            this.#setState(++this.#state)

        previousBtn.onclick = () => {
            this.#state === 0
                ? this.#setState(this.#numberOfSlide - 1)
                : this.#setState(--this.#state)
        }
    }


    #setState(nextState: number): void {
        this.#state = nextState
    }
}

const SliderComp = new Slider()

renderingLoop.addComponent(SliderComp)
export default SliderComp
