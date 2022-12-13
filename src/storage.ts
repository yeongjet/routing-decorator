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
    export interface Parameter {
        index: number
        type?: any
        getter: (request: any, response: any) => any
    }
    
    export interface Handler {
        method?: Function
        requestMethod?: RequestMethod
        url: string
        parameterCount: number
    }
    
    export interface Route {
        bindingHandler: Handler
        bindingParameters: Parameter[]
    }
    
    export interface Routes extends Record<string, Route> {}
    
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
