export const PARAM_TYPE_METADATA = 'design:paramtypes'

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
