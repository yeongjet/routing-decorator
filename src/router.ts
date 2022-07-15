import 'reflect-metadata'
import { isConstructor, isFunction, isNil, addLeadingSlash, isValidatable, getParamCount } from './util.js'
import { HttpMethod, HTTP_ROUTE_PATH_METADATA, PARAM_TYPE_METADATA, HTTP_METHOD_METADATA, PARAM_METADATA } from './common/constant/index.js'
import { plainToInstance, ClassTransformOptions } from 'class-transformer'
import { validateSync, ValidatorOptions, ValidationError } from 'class-validator'
import { getClassMethodName } from './util.js'

interface Option {
    enableClassValidator?: boolean
    classTransformOption?: ClassTransformOptions
    validateOption?: ValidatorOptions
    onValidateError?: (request, response, error: ValidationError[]) => void
}

const defaultOption: Option = {
    enableClassValidator: true
}

interface RouteBinding {
    routePath: string
    requestMethod: string
    handler: Function
    handlerName: string
}

const getRouteBinding = (instance: any, prefix?: string): RouteBinding[] => {
    const prototype = Object.getPrototypeOf(instance)
    const methodNames = getClassMethodName(prototype)
    return methodNames
        .map(methodName => {
            const instanceCallback = instance[methodName]
            const prototypeCallback = prototype[methodName]
            const routePath = Reflect.getMetadata(HTTP_ROUTE_PATH_METADATA, prototypeCallback)
            if (isNil(routePath)) {
                return null
            }
            const requestMethod = Reflect.getMetadata(HTTP_METHOD_METADATA, prototypeCallback)
            return {
                routePath: `${prefix}${routePath}`,
                requestMethod,
                handler: instanceCallback,
                handlerName: methodName
            }
        })
        .filter(n => !isNil(n)) as RouteBinding[]
}

export const bindRouter = (controllers, router, option: Option) => {
    const { enableClassValidator, classTransformOption, validateOption, onValidateError } = { ...defaultOption, ...option }
    controllers.map(controller => {
        const prefix = Reflect.getMetadata(HTTP_ROUTE_PATH_METADATA, controller.constructor)
        const routeBinding = getRouteBinding(controller, prefix)
        routeBinding.map(({ requestMethod, routePath, handler, handlerName }) => {
            const paramMetadata = Reflect.getMetadata(PARAM_METADATA, controller.constructor, handlerName)
            const paramType = Reflect.getMetadata(PARAM_TYPE_METADATA, controller, handlerName)
            const paramCount = getParamCount(paramMetadata)
            router.on(HttpMethod[requestMethod], routePath, (request, reply) => {
                if (!paramMetadata?.length) {
                    return handler.apply(controller, [ request, reply ])
                }
                const param: any[] = new Array(paramCount).fill(undefined)
                let isValidated = true
                for(const { index, extract } of paramMetadata) {
                    let value = extract(request, reply)
                    value = isNil(value) ? {} : value
                    if (enableClassValidator) {
                        const dto = paramType[index]
                        if (isValidatable(dto)) {
                            const entity = plainToInstance(dto, value, classTransformOption)
                            const error = validateSync(entity, validateOption)
                            if (error.length > 0) {
                                if (onValidateError) {
                                    onValidateError(request, reply, error)
                                }
                                isValidated = false
                                break
                            }
                            value = entity
                        }
                    }
                    param[index] = value
                }
                if (isValidated) {
                    return handler.apply(controller, param)
                }
            })
        })
    })
}
