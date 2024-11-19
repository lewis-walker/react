export type ReactElement = {
    parent?: ReactElement;
    id?: string;
    type: string | Function;
    props: any;
    ref?: {current: HTMLElement | undefined }
}

export type ReactNode = string | number | boolean | null | undefined | ReactElement

export type Context<T> = {
    Provider: ((props: { value?: T }) => any) & { provides: Context<T>, value: T }
}