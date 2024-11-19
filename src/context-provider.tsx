import { Context } from "./react-model"

export const createContextProvider = <T,>(initialValue: T): Context<T>['Provider'] => {
    const component = (props: { value?: T, children: any }) => {
        if (Object.prototype.hasOwnProperty.call(props, 'value')) {
            const c: any = component
            c.value = props.value
        }
        return props.children
    }

    const c: any = component
    c.value = initialValue
    return c
} 