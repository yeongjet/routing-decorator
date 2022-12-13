import _ from 'lodash'
import { guard } from './util'
import { storage, RequestMethod, RequestMethodName } from './storage'

export interface RoutingDecoratorOption {
    transformRequestParameter?: (requestParameter: any, bindingParameterType: any, ctx: any) => any
}

export class RoutingDecorator {

    private option!: RoutingDecoratorOption

    constructor(option?: RoutingDecoratorOption) {
        this.option = option || {}
    }

    bindRouter(bind: (requestMethod: RequestMethodName, url: string, handler: (request: any, response: any) => void) => void ) {
        const { transformRequestParameter } = this.option
        for(const [ controllerName, controllerStorage ] of Object.entries(storage.controllers ?? {})) {
            for(const [ routeName, routeStorage ] of Object.entries(controllerStorage.routes ?? {})) {
                const { requestMethod, url, method, parameterCount } = routeStorage.bindingHandler
                guard(!(_.isNil(requestMethod) || !_.isString(url)), 'requestMethod and url must be set')
                bind(RequestMethod[requestMethod!] as RequestMethodName, `${controllerStorage.prefix}${url as string}`, (request, response) => {
                    guard(!_.isNil(method), 'handler method must be set')
                    const handlerParameters: any[] = new Array(parameterCount).fill(undefined)
                    for(const { index, getter, type } of routeStorage.bindingParameters || []) {
                        let requestParameter = getter(request, response)
                        if (transformRequestParameter) {
                            const transformedParameter = transformRequestParameter(requestParameter, type, { request, response })
                            if (_.isNil(transformedParameter)) {
                                return
                            }
                            requestParameter = transformedParameter
                        }
                        handlerParameters[index] = requestParameter
                    }
                    return (method as Function)(...handlerParameters)
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
                    routeStorage.bindingHandler.method = externalController[routeName].bind(externalController)
                }
            }
        })
        return this
    }
}
