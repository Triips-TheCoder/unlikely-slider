type JSXFunction = () => string

interface Component {
    render(): string

    get unmount(): boolean

    get state(): any
}
