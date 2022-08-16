import { RequestMethod } from './request'
import { Property } from '../common'

export type Handler = (req: any, res: any) => any

export enum ParamSource {
    REQUEST,
    RESPONSE,
    BODY,
    QUERY,
    PARAM,
    HEADERS,
    SESSION,
    HOST,
    IP
}

export namespace Storage {
    export interface Param {
        source: ParamSource
        index: number
        type: any
        selectKey?: string
        getter: (req: any, res: any) => any
    }
    
    export interface Route {
        handler?: Function
        name: Property
        requestMethod?: RequestMethod
        url: string
        params: Param[]
        paramsCount: number
    }
    
    export interface Controller {
        prefix: string
        routes: Route[]
    }
    
}

export type Storage = Record<string, Storage.Controller>

