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

export interface Parameter {
    binding: ParameterBinding
    index: number
    type: any
    selectKey?: string
    getter: (req: any, res: any) => any
}

export interface Route {
    handler?: Function
    requestMethod?: RequestMethod
    url: string
    bindingParameters: Parameter[]
    parameterCount: number
}

export interface Routes extends Record<string, Route> {}

export interface Controller {
    prefix: string
    routes?: Routes
}

export interface Controllers extends Record<string, Controller> {}

export type Storage = {
    controllers?: Controllers
}

export const storage: Storage = {}
