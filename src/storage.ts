export type RequestMethodName = keyof typeof RequestMethod

export enum RequestMethod {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    OPTIONS,
    HEAD
}

export enum ParameterBinding {
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
    export interface BindingParameter {
        index: number
        type?: any
        getter: (request: any, response: any) => any
    }
    
    export interface RouteBinding {
        handler?: Function
        requestMethod?: RequestMethod
        url: string
        handlerParametersCount: number
        parametersInjected: BindingParameter[]
    }

    export interface Routes extends Record<string, RouteBinding> {}
    
    export interface Controller {
        prefix: string
        routes?: Routes
    }
    
    export interface Controllers extends Record<string, Controller> {}
}

export type Storage = {
    controllers?: Storage.Controllers
}

export const storage: Storage = {}
