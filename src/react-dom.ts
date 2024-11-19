import { endRender, isReactElement, queueRender, setGlobalRender, startRender } from "./react";
import { ReactElement, ReactNode } from "./react-model";

let container: HTMLElement
let rootNode: ReactNode

const getAncestry = (element: ReactElement): ReactElement[] => {
    const ancestry: ReactElement[] = []
    let currentElement: ReactElement | undefined = element.parent

    while (currentElement) {
        ancestry.unshift(currentElement)
        currentElement = currentElement.parent
    }

    return ancestry
}


const _render = (reactNode: ReactNode, container: HTMLElement | null): void => {
    if (Array.isArray(reactNode)) {
        reactNode.forEach(node => {
            _render(node, container)
        })
        return
    }

    if (!container) {
        throw new Error("Container is required");
    }

    if (container instanceof Text) {
        throw new Error("Container cannot be a text node");
    }

    if (reactNode && !isReactElement(reactNode)) {
        container.appendChild(document.createTextNode(String(reactNode)));
        return
    }

    let element: HTMLElement | Text

    const node: any = reactNode
    const reactElement: ReactElement = node

    const { type, props } = reactElement;

    if (typeof type === "function") {
        startRender(reactElement)
        const functionalComponentOutput = type(props)
        functionalComponentOutput.parent = reactElement
        _render(functionalComponentOutput, container);
        endRender()
        return
    }
    
    element = document.createElement(type);

    const htmlElement: HTMLElement = element;

    if (reactElement.ref) {
        if (!reactElement.ref.current) {
            reactElement.ref.current = htmlElement;
            queueRender();
        }
    }

    props && Object.entries(props).forEach(([key, value]) => {
        if (key.startsWith('on')) {
            // Handle event listeners
            const eventName = key.toLowerCase().substring(2);
            const listener: any = value;
            htmlElement.addEventListener(eventName, listener);
            return;
        }
        
        // Handle regular attributes
        if (typeof value === 'string') {
            htmlElement.setAttribute(key, value);
        }
    });

    let children = props?.children

    if (children && !Array.isArray(children)) {
        children = [props.children]
    }

    children && children.forEach((child: ReactElement) => {
        _render(child, htmlElement);
    });

    container.appendChild(element);
}

const globalRender = (): void => {
    container.childNodes?.forEach(node => {
        node.remove()
    })

    _render(rootNode, container)
}

export const render = (reactElement: ReactElement, _container: HTMLElement | null): void => {
    if (!_container) {
        throw new Error("Container is required");
    }

    container = _container
    rootNode = reactElement
    queueRender();
}

setGlobalRender(globalRender)