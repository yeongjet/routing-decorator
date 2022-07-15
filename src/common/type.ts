import { HttpMethod, InjectParamType } from './constant'

export interface Param {
    type: InjectParamType,
    index: number,
    getter: (req: any, res: any, next: any) => any
}

export interface Route {
    handlerName: string
    httpMethod?: HttpMethod
    url?: string
    params?: Param[]
}

export interface Controller {
    prefix: string
    routes: Route[]
}

export type Storage = Record<string, Controller>