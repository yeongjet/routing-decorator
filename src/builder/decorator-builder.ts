import 'reflect-metadata'
import _ from 'lodash'
import { setParam, setRoute, setController } from '../storage'
import { ParamSource, RequestMethod, PARAM_TYPE_METADATA, Property } from '../common'
import { addLeadingSlash } from '../util'

const createParamGetter = (type: ParamSource, key?: string) => (request, response) => {
    switch (type) {
        case ParamSource.REQUEST:
            return request as any
        case ParamSource.RESPONSE:
            return response as any
        case ParamSource.BODY:
            return key && request.body ? request.body[key] : request.body
        case ParamSource.PARAM:
            return key ? request.params[key] : request.params
        case ParamSource.HOST:
            const hosts = request.hosts || {}
            return key ? hosts[key] : hosts
        case ParamSource.QUERY:
            return key ? request.query[key] : request.query
        case ParamSource.HEADERS:
            return key ? request.headers[key.toLowerCase()] : request.headers
        case ParamSource.SESSION:
            return request.session
        case ParamSource.IP:
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
    (paramSource: ParamSource) =>
    (selectKey?: string): ParameterDecorator =>
    (target: Object, property: Property, index: number) => {
        const paramsType = Reflect.getMetadata(PARAM_TYPE_METADATA, target, property)
        setParam(target.constructor.name, property, {
            source: paramSource,
            index,
            type: paramsType.at(index),
            selectKey,
            getter: createParamGetter(paramSource, selectKey)
        })
    }

export const createRequestMethodDecorator =
    (requestMethod: RequestMethod) =>
    (url?: string): MethodDecorator =>
    (target: Object, property: Property, descriptor: TypedPropertyDescriptor<any>) => {
        const paramsType = Reflect.getMetadata(PARAM_TYPE_METADATA, target, property)
        setRoute(target.constructor.name, property, { handler: target[property], requestMethod, url: url ? addLeadingSlash(url) : '', paramsCount: paramsType.length })
    }
