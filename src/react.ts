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
    setValue: (value: T | ((t: T) => T)) => void;
}

type UseEffect = {
    callback: () => void | (() => void);
    cleanup: () => void;
    dependencies: any[];
}

type FunctionComponentState = {
    id: string;
    reactElement: ReactElement;

    useStates: Array<UseState<any>>;
    useEffects: Array<UseEffect>;

    currentStateIndex: number;
    currentEffectIndex: number;
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
        useState = { value, setValue: value => value }
        useState.setValue = arg => {
            if (typeof arg === "function") {
                const fn: Function = arg
                useState.value = fn(useState.value)
            } else {
                useState.value = arg
            }

            queueRender()
        }
        currentFunctionState.useStates[currentFunctionState.currentStateIndex] = useState
    }

    currentFunctionState.currentStateIndex++
    return useState
}

const getUseEffect = (callback: () => void | (() => void), dependencies: any[]) => {
    if (!currentFunctionState) {
        throw new Error("useEffect must be called within a function component")
    }

    let useEffect: UseEffect = currentFunctionState.useEffects[currentFunctionState.currentEffectIndex]

    if (!useEffect) {
        useEffect = { callback, dependencies: dependencies.length === 0 ?
            [undefined] : dependencies, cleanup: () => void 0 }
        currentFunctionState.useEffects[currentFunctionState.currentEffectIndex] = useEffect
    }

    if (dependencies.length === 0) {
        dependencies = [1]
    }

    if (useEffect.dependencies.length !== dependencies.length) {
        throw new Error("useEffect dependencies length changed")
    }
    
    for (let i = 0; i < dependencies.length; i++) {
        if (useEffect.dependencies[i] !== dependencies[i]) {
            useEffect.dependencies = dependencies
            useEffect.callback = callback

            useEffect.cleanup()
            const result = useEffect.callback() || (() => void 0)
            useEffect.cleanup = result

            break 
        }
    }

    currentFunctionState.currentEffectIndex++
    return useEffect
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
        id = genUuid()
        fn.__REACTISH_FUNCTION_ID__ = id
        functionComponentState = { id, reactElement, useStates: [], useEffects: [], currentStateIndex: 0, currentEffectIndex: 0 }
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
    ref?: {current: HTMLElement | undefined }
}

export type ReactNode = string | number | boolean | null | undefined | ReactElement

export const isReactElement = (node: ReactNode) => typeof node === 'object' && node !== null && 'type' in node

export const startRender = (reactElement: ReactElement) => {
    currentFunctionState = ensureFunctionComponentState(reactElement)
    functionStateStack.push(currentFunctionState)
    currentFunctionState.currentStateIndex = 0
    currentFunctionState.currentEffectIndex = 0
}

export const endRender = () => {
    functionStateStack.pop()
    currentFunctionState = functionStateStack[functionStateStack.length - 1]
}

export const createElement = (type: string, props: any, ...children: any[]): ReactElement => {
    return { type, props: { ...props,children, javascriptType: typeof type } };
}

export const useState = <T>(initialValue: T): [T, (value: T | ((v: T) => T)) => void] => {
    const useState = getUseState(initialValue)
    return [useState.value, useState.setValue]
}

export const useEffect = (callback: () => void, dependencies: any[]) => {
    getUseEffect(callback, dependencies)
}

export const useRef = <T>(initialValue?: T) => {
    const [ref ] = useState({ current: initialValue })
    return ref
}