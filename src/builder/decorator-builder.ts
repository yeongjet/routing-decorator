import _ from 'lodash'
import { addParam, addRoute } from '../storage'
import { createParamGetter } from './common-builder'
import { guard } from '../util'
import { InjectParamType, HttpMethod } from '../common'

export const createParamDecorator =
    (paramType: InjectParamType) =>
    (selectKey?: string): ParameterDecorator =>
    (target: Object, property: string | symbol, index: number) => {
        guard(_.isString(property), 'type of property must be string')
        addParam(target.constructor.name, property as string, {
            type: paramType,
            index,
            getter: createParamGetter(paramType, selectKey)
        })
    }

export const createHttpMethodDecorator =
    (httpMethod: HttpMethod) =>
    (url = ''): MethodDecorator =>
    (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        guard(_.isString(property), 'type of property must be string')
        addRoute(target.constructor.name, { handlerName: property as string, httpMethod, url })
    }
