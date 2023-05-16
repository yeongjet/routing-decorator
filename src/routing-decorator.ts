import _ from 'lodash'
import { guard } from './util'
import { storage, RequestMethod, RequestMethodName } from './storage'

export interface RoutingDecoratorOption {
    onReceivedParameter?: (requestParameter: any, bindingParameterType: any, ctx: any) => any
}

export class RoutingDecorator {

    private option!: RoutingDecoratorOption

    constructor(option?: RoutingDecoratorOption) {
        this.option = option || {}
    }

    bindRouter(bind: (requestMethod: RequestMethodName, url: string, handler: (request: any, response: any) => void) => void ) {
        const { onReceivedParameter } = this.option
        for(const [ controllerName, controller ] of Object.entries(storage.controllers ?? {})) {
            for(const [ routeName, routeBinding ] of Object.entries(controller.routes ?? {})) {
                guard(!(_.isNil(routeBinding.requestMethod) || !_.isString(routeBinding.url)), 'requestMethod and url must be set')
                bind(RequestMethod[routeBinding.requestMethod!] as RequestMethodName, `${controller.prefix}${routeBinding.url as string}`, (request, response) => {
                    guard(!_.isNil(routeBinding.handler), 'handler method must be set')
                    const handlerParameters: any[] = new Array(routeBinding.handlerParametersCount).fill(undefined)
                    for(const { index, getter, metadataType } of routeBinding.parametersInjected || []) {
                        let requestParameter = getter(request, response)
                        if (onReceivedParameter) {
                            const processedParameter = onReceivedParameter(requestParameter, metadataType, { request, response })
                            if (_.isNil(processedParameter)) {
                                return
                            }
                            requestParameter = processedParameter
                        }
                        handlerParameters[index] = requestParameter
                    }
                    return routeBinding.handler!.apply(controller, handlerParameters)
                })
            }
        }
        return this
    }

    bindControllers(controllers: Object[]) {
        controllers.map(externalController => {
            const controllerStorage = (storage.controllers ?? {})[externalController.constructor.name]
            if (controllerStorage) {
                for(const [ routeName, routeBinding ] of Object.entries(controllerStorage.routes ?? {})) {
                    routeBinding.handler = externalController[routeName].bind(externalController)
                }
            }
        })
        return this
    }
}
