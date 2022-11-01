import _ from 'lodash'
import { guard, negate } from './util'
import { RequestMethod, RequestMethodName } from './storage'
import { storage } from './storage'

export interface RoutingDecoratorOption {
    validation?: {
        continueOnError: boolean
        handler?: (type: any, value: any, ctx: any) => any
    }
}

const defaultOption: RoutingDecoratorOption = {
    validation: {
        continueOnError: false
    }
}

export class RoutingDecorator {

    private option!: RoutingDecoratorOption

    constructor(option?: RoutingDecoratorOption) {
        this.option = _.defaultsDeep(option, defaultOption)
    }

    bindRouter(bind: (requestMethod: RequestMethodName, url: string, handler: (request: any, response: any) => void) => void ) {
        const { validation: validateOption } = this.option
        for(const [ controllerName, controllerStorage ] of Object.entries(storage.controllers ?? {})) {
            for(const [ routeName, routeStorage ] of Object.entries(controllerStorage.routes ?? {})) {
                const { requestMethod, url } = routeStorage
                guard(negate(_.isNil(requestMethod) || !_.isString(url)), 'requestMethod and url must be set')
                bind(RequestMethod[requestMethod!] as RequestMethodName, `${controllerStorage.prefix}${url as string}`, (request, response) => {
                    const { handler, bindingParameters, parameterCount } = routeStorage
                    guard(negate(_.isNil(handler)), 'handler must be set')
                    const handlerParams: any[] = new Array(parameterCount).fill(undefined)
                    for(const { index, getter, type } of bindingParameters) {
                        let requestParam = getter(request, response)
                        if (validateOption?.handler) {
                            const validatedParam = validateOption?.handler(type, requestParam, { request, response })
                            if (_.isNil(validatedParam) && !validateOption.continueOnError) {
                                return
                            }
                            requestParam = validatedParam
                        }
                        handlerParams[index] = requestParam
                    }
                    return (handler as Function)(...handlerParams)
                })
            }
        }
        return this
    }

    bindControllers(externalControllers: Object[]) {
        externalControllers.map(externalController => {
            const controllerStorage = (storage.controllers ?? {})[externalController.constructor.name]
            if (controllerStorage) {
                for(const [ routeName, routeStorage ] of Object.entries(controllerStorage.routes ?? {})) {
                    routeStorage.handler = externalController[routeName].bind(externalController)
                }
            }
        })
        return this
    }
}
