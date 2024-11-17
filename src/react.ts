let globalRender: () => void

export const genUuid = () => Math.random().toString(36).substring(2, 15);

let renderTimeout: NodeJS.Timeout | null = null

export const queueRender = () => {
    if (renderTimeout) {
        return
    }

    renderTimeout = setTimeout(() => {
        renderTimeout = null
        globalRender()
    }, 0)
}

type UseState<T> = {
    value: T;
    setValue: (value: T) => void;
}

type FunctionComponentState = {
    id: string;
    reactElement: ReactElement;
    useStates: Array<UseState<any>>;
    currentStateIndex: number;
}

const functionStateStack: FunctionComponentState[] = []
let currentFunctionState: FunctionComponentState | null = null

const functionComponentStates: Record<string, FunctionComponentState> = {}

const getUseState = <T>(initialValue: T) => {
    if (!currentFunctionState) {
        throw new Error("useState must be called within a function component")
    }

    let useState: UseState<T> = currentFunctionState.useStates[currentFunctionState.currentStateIndex]

    if (!useState) {
        const value = initialValue
        useState = { value, setValue: (value: T) => void 0 }
        useState.setValue = (value: T) => {
            useState.value = value
            queueRender()
        }
        currentFunctionState.useStates[currentFunctionState.currentStateIndex] = useState
    }

    currentFunctionState.currentStateIndex++
    return useState
}

const ensureFunctionComponentState = (reactElement: ReactElement) => {
    let functionComponentState: FunctionComponentState

    if (typeof reactElement.type !== "function") {
        throw new Error("reactElement.type must be a function")
    }

    const f: any = reactElement.type
    const fn: Function & { __REACTISH_FUNCTION_ID__: string } = f

    let id = fn.__REACTISH_FUNCTION_ID__

    if (!id) {
        console.log("function does not have a __REACTISH_FUNCTION_ID__, generating one", JSON.stringify(reactElement, null, 2))
        id = genUuid()
        fn.__REACTISH_FUNCTION_ID__ = id
        functionComponentState = { id, reactElement, useStates: [], currentStateIndex: 0 }
        functionComponentStates[id] = functionComponentState
        return functionComponentState
    }

    return functionComponentStates[id]
}

export const setGlobalRender = (render: () => void) => {
    globalRender = render
}

export type ReactElement = {
    id?: string;
    type: string | Function;
    props: any;
}

export type ReactNode = string | number | boolean | null | undefined | ReactElement

export const isReactElement = (node: ReactNode) => typeof node === 'object' && node !== null && 'type' in node

export const startRender = (reactElement: ReactElement) => {
    currentFunctionState = ensureFunctionComponentState(reactElement)
    functionStateStack.push(currentFunctionState)
    currentFunctionState.currentStateIndex = 0
}

export const endRender = () => {
    functionStateStack.pop()
    currentFunctionState = functionStateStack[functionStateStack.length - 1]
}

export const createElement = (type: string, props: any, ...children: any[]): ReactElement => {
    return { type, props: { ...props, children, javascriptType: typeof type } };
}

export const useState = <T>(initialValue: T): [T, (value: T) => void] => {
    if (!currentFunctionState) {
        throw new Error("useState must be called within a function component")
    }

    const useState = getUseState(initialValue)
    return [useState.value, useState.setValue]
}

export const useEffect = (callback: () => void, dependencies: any[]) => {
    // callback();
}