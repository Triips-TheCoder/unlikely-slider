import { app } from '../index'

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
            console.log(component.state)
            component.state !== oldComponentState
                ? (console.log('shit'), app.innerHTML = component.render(), oldComponentState = component.state)
                : console.log('SAME')
        })
    }

    const start = () =>
        requestAnimationFrame(workLoop)

    return { start, addComponent, removeComponent }
})()

export default renderingLoop
