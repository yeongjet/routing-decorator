import 'reflect-metadata'
import _ from 'lodash'
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
    (selectKey?: string) =>
    (...[ target, property, index ]: ParameterDecoratorParams) => {
        guard(_.isString(property), `property name must be string`)
        set(storage, `controllers.${target.constructor.name}.routes.${property as string}.bindingParameters`, [
            {
                binding,
                index,
                type: Reflect.getMetadata(PARAMETER_METADATA, target, property).at(index),
                selectKey,
                getter: createParamGetter(binding, selectKey)
            }
        ])
    }

export const createRequestMethodDecorator =
    (requestMethod: RequestMethod) =>
    (url?: string): MethodDecorator =>
    (...[ target, property ]: MethodDecoratorParams) => {
        guard(_.isString(property), `property name must be string`)
        const parameterCount = Reflect.getMetadata(PARAMETER_METADATA, target, property).length
        set(storage, `controllers.${target.constructor.name}.routes.${property as string}`, {
            handler: target[property],
            requestMethod,
            url: url ? addLeadingSlash(url) : '',
            parameterCount
        })
    }
