import { app } from '../index'
import noop from '../noop'

const renderingLoop = (() => {

    let componentQueue = new Set()
    let oldComponentState: any = 0
    let hasComponentInQueue = false

    const addComponent = (component) => {
        componentQueue.add(component)
        hasComponentInQueue = true
    }

    const removeComponent = (component) =>
        componentQueue.delete(component)

    const workLoop = () => {
        requestAnimationFrame(workLoop)

        hasComponentInQueue && componentQueue.forEach(component => {
            component.state !== oldComponentState
                ? (app.innerHTML = component.render(), oldComponentState = component.state)
                : noop()
        })
    }
    requestAnimationFrame(workLoop)

    return { addComponent, removeComponent }
})()

export default renderingLoop
