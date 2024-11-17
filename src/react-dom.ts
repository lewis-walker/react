import { endRender, isReactElement, queueRender, ReactElement, ReactNode, setGlobalRender, startRender } from "./react";

let container: HTMLElement
let rootNode: ReactNode

const _render = (reactNode: ReactNode, container: HTMLElement | null): void => {
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
        _render(type(props), container);
        endRender()
        return
    }
    
    element = document.createElement(type);

    const htmlElement: HTMLElement = element;

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

    props && props.children && props.children.forEach((child: ReactElement) => {
        _render(child, htmlElement);
    });

    container.appendChild(element);
}

const globalRender = (): void => {
    container.childNodes.forEach(node => {
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