import { RequestMethod, InjectParamType } from './constant'

export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>

export type Handler = (req: any, res: any) => any

export interface Param {
    type: InjectParamType,
    index: number,
    getter: (req: any, res: any) => any
}

export interface Route {
    handler: Function
    handlerName: string
    requestMethod?: RequestMethod
    url?: string
    injectParams: Param[]
    handlerParamsType: any[]
}

export interface Controller {
    name: string
    prefix: string
    routes: Route[]
}

export type Storage = Record<string, Controller>