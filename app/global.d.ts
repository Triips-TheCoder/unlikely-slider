type JSXFunction = () => string
type useStateT = <T>(value: T) => [{value: T}, (callback) => void]
