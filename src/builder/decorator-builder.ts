import 'reflect-metadata'
import _ from 'lodash'
import { setParam, setRoute, setController } from '../storage'
import { InjectParamType, RequestMethod, PARAM_TYPE_METADATA } from '../common'
import { addLeadingSlash } from '../util'

const createParamGetter = (type: InjectParamType, key?: string) => (request, response) => {
    switch (type) {
        case InjectParamType.REQUEST:
            return request as any
        case InjectParamType.RESPONSE:
            return response as any
        case InjectParamType.BODY:
            return key && request.body ? request.body[key] : request.body
        case InjectParamType.PARAM:
            return key ? request.params[key] : request.params
        case InjectParamType.HOST:
            const hosts = request.hosts || {}
            return key ? hosts[key] : hosts
        case InjectParamType.QUERY:
            return key ? request.query[key] : request.query
        case InjectParamType.HEADERS:
            return key ? request.headers[key.toLowerCase()] : request.headers
        case InjectParamType.SESSION:
            return request.session
        case InjectParamType.IP:
            return request.ip
        default:
            return null
    }
}

export const createControllerDecorator =
    (prefix = ''): ClassDecorator =>
    (target: Function) => {
        setController(target.name, { prefix })
    }

export const createParamDecorator =
    (paramType: InjectParamType) =>
    (selectKey?: string): ParameterDecorator =>
    (target: Object, property: string | symbol, index: number) => {
        setParam(target.constructor.name, target[property], {
            type: paramType,
            index,
            getter: createParamGetter(paramType, selectKey)
        })
    }

export const createRequestMethodDecorator =
    (requestMethod: RequestMethod) =>
    (url: string): MethodDecorator =>
    (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const paramsType = Reflect.getMetadata(PARAM_TYPE_METADATA, target, property)
        setRoute(target.constructor.name, { handler: target[property], requestMethod, url: addLeadingSlash(url), handlerParamsType: paramsType })
    }
