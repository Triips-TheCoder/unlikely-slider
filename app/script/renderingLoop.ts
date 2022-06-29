import { app } from '../index'
import noop from '../noop'

const renderingLoop = (() => {

    let componentQueue = new Set<Component>()
    let oldComponentState: number = 0
    let hasComponentInQueue = false

    const addComponent = (component: Component) => {
        componentQueue.add(component)
        hasComponentInQueue = true
    }

    const workLoop = () => {
        requestAnimationFrame(workLoop)

        hasComponentInQueue && componentQueue.forEach(component => {
            if (component.unmount) {
                app.innerHTML = ''
                return
            }

            component.state !== oldComponentState
                ? (app.innerHTML = component.render(), oldComponentState = component.state)
                : noop()
        })
    }
    requestAnimationFrame(workLoop)

    return { addComponent }
})()

export default renderingLoop
