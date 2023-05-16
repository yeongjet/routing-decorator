import 'reflect-metadata'
import { isString } from 'lodash'
import { addLeadingSlash, guard, set } from '../util'
import { storage, RequestMethod, ParameterBinding } from '../storage'
import { MethodDecoratorParams, ParameterDecoratorParams } from '../interface'

export const PARAMETER_METADATA = 'design:paramtypes'

export type PropertyKey = string | symbol

const createParamGetter = (binding: ParameterBinding, key?: string) => (request, response) => {
    switch (binding) {
        case ParameterBinding.REQUEST:
            return request as any
        case ParameterBinding.RESPONSE:
            return response as any
        case ParameterBinding.BODY:
            return key && request.body ? request.body[key] : request.body
        case ParameterBinding.PARAM:
            return key ? request.params[key] : request.params
        case ParameterBinding.HOST:
            const hosts = request.hosts || {}
            return key ? hosts[key] : hosts
        case ParameterBinding.QUERY:
            return key ? request.query[key] : request.query
        case ParameterBinding.HEADERS:
            return key ? request.headers[key.toLowerCase()] : request.headers
        case ParameterBinding.SESSION:
            return request.session
        case ParameterBinding.IP:
            return request.ip
        default:
            return null
    }
}

export const createParameterBindingDecorator =
    (binding: ParameterBinding) =>
    (selectKey?: string): ParameterDecorator =>
    (...[ target, property, index ]: ParameterDecoratorParams) => {
        guard(isString(property), `property name must be string`)
        set(storage, `controllers.${target.constructor.name}.routes.${property as string}.parametersInjected`, [
            {
                index,
                type: Reflect.getMetadata(PARAMETER_METADATA, target, property as string).at(index),
                getter: createParamGetter(binding, selectKey)
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
