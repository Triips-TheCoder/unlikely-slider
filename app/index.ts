import render from './script/render'
import App from './App'
import { componentStack } from './script/componentStack'
import 'global.scss'
const app = document.querySelector('#app') as HTMLElement
componentStack.set('App', App)

window.addEventListener('DOMContentLoaded', () =>
    render(app as HTMLElement, '<App/>')
)



export {app}
