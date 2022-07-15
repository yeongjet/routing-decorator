export const HTTP_METHOD_METADATA = 'routing-decorator/http:method'
export const HTTP_ROUTE_PATH_METADATA = 'routing-decorator/http:route-path'
export const PARAM_METADATA = 'routing-decorator/param'
export const PARAM_TYPE_METADATA = 'design:paramtypes'

export enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    ALL,
    OPTIONS,
    HEAD
}

export enum InjectParamType {
    REQUEST,
    RESPONSE,
    BODY,
    QUERY,
    PARAM,
    HEADER,
    SESSION,
    HOST,
    IP
}
