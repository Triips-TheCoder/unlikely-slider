import styles from './styles.module.scss'
import renderingLoop from '../../script/renderingLoop'
/*const useState: useStateT = <K>(value: K) => {
    const state = {
        value: value
    }

    const setter = (callback: any) => {
        callback()
    }

    return [state, setter]
}*/
const UnlikelyReact = (() => {
    let hooks = []
    let componentStack = []
    let index = 0

    const useState = (initalValue: any) => {
        const state = hooks[index] || initalValue
        const _index = index
        const setState = (nextState: any) => {
            console.log('NEXT STATE', nextState)
            hooks[_index] = nextState
        }
        index++
        return [state, setState]
    }

    const useEffect = (callback, dependenciesArray) => {
        const oldDeps = hooks[index]
        let hasChanged = true
        if (oldDeps) {
            hasChanged = dependenciesArray.some((dep, i) => !Object.is(dep, oldDeps[i]))
        }
        if (hasChanged) callback()

        hooks[index] = dependenciesArray
        index++
    }

    const render = (Component) => {
        index = 0
        const C = Component()
        C.render()
        return C
    }

    return { useState, render, useEffect }
})()

class Slider {
    #state: number

    constructor() {
        this.#state = 0
        this.#onMount()
    }

    public get state() {
        return this.#state
    }

    public render() {
        setTimeout(() => {
            this.#afterRender()
        }, 100)

        return `
        <button>Click</button>
          <p>${ this.#state }</p>
         <h2 class="${ styles.backgroundRed }">Hello je suis le slider</h2>
         <div>
            <button>Prev</button>
              <div>
                <div>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                </div>
            </div>
            <button>Next</button>
         </div>
        `
    }

    #onMount() {
        console.log('composant monté')
        window.onload = () => {
            document.querySelector('button')!.onclick = () => {
                this.#setState(this.#state + 1)
                console.log(this.#state)
            }
        }

    }

    #onUnmount() {
        console.log('composé démonté')
    }

    #afterRender() {
        document.querySelector('button')!.onclick = () => {
            this.#setState(this.#state + 1)
            console.log(this.#state)
        }
    }

    #setState(nextState: number) {
        this.#state = nextState
    }
}

const SliderComp = new Slider()

renderingLoop.addComponent(SliderComp)
export default SliderComp
