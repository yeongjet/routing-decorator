import 'reflect-metadata'
import { isString } from 'lodash'
import { addLeadingSlash, guard, set } from '../util'
import { storage, RequestMethod, ParameterBindingType } from '../storage'
import { MethodDecoratorParams, ParameterDecoratorParams } from '../interface'

export const PARAMETER_METADATA = 'design:paramtypes'

export type PropertyKey = string | symbol

const createParamGetter = (bindingType: ParameterBindingType, key?: string) => (request, response) => {
    switch (bindingType) {
        case ParameterBindingType.REQUEST:
            return request as any
        case ParameterBindingType.RESPONSE:
            return response as any
        case ParameterBindingType.BODY:
            return key && request.body ? request.body[key] : request.body
        case ParameterBindingType.PARAM:
            return key ? request.params[key] : request.params
        case ParameterBindingType.HOST:
            const hosts = request.hosts || {}
            return key ? hosts[key] : hosts
        case ParameterBindingType.QUERY:
            return key ? request.query[key] : request.query
        case ParameterBindingType.HEADERS:
            return key ? request.headers[key.toLowerCase()] : request.headers
        case ParameterBindingType.SESSION:
            return request.session
        case ParameterBindingType.IP:
            return request.ip
        default:
            return null
    }
}

export const createParameterBindingDecorator =
    (bindingType: ParameterBindingType) =>
    (selectKey?: string): ParameterDecorator =>
    (...[ target, property, index ]: ParameterDecoratorParams) => {
        guard(isString(property), `property name must be string`)
        set(storage, `controllers.${target.constructor.name}.routes.${property as string}.parametersInjected`, [
            {
                index,
                metadataType: Reflect.getMetadata(PARAMETER_METADATA, target, property as string).at(index),
                getter: createParamGetter(bindingType, selectKey),
                bindingType,
                selectKey
            }
        ])
    }

export const createRequestMethodDecorator =
    (requestMethod: RequestMethod) =>
    (url?: string): MethodDecorator =>
    (...[ target, property ]: MethodDecoratorParams) => {
        guard(isString(property), `property name must be string`)
        const routeBindingSetPath = `controllers.${target.constructor.name}.routes.${property as string}`
        set(storage, `${routeBindingSetPath}.handler`, target[property as string])
        set(storage, `${routeBindingSetPath}.requestMethod`, requestMethod)
        set(storage, `${routeBindingSetPath}.url`,  url ? addLeadingSlash(url) : '')
        set(storage, `${routeBindingSetPath}.handlerParametersCount`, Reflect.getMetadata(PARAMETER_METADATA, target, property as string).length)
    }
