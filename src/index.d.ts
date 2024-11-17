declare module 'react/jsx-runtime' {
    export namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}