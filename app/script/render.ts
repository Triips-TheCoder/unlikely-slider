import { componentStack } from './componentStack'

const render = (root: HTMLElement, appComponent: string) => {
    const removeSign = /[a-zA-Z]+/
    const functionName = appComponent
        .split('')
        .filter(char => char.match(removeSign))
        .join('')

    componentStack.has(functionName)
        ? root.innerHTML = componentStack.get(functionName)?.()!
        : console.warn('Veuillez ajouter le composant <App/> dans la stack')
}


export default render
