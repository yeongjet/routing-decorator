import { guard, negate } from './util'
import { RequestMethod, RequestMethodName } from './common'
import * as storage from './storage'
import _ from 'lodash'

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
        storage.getControllers().map(controller => {
            controller.routes.map(route => {
                const { requestMethod, url } = route
                guard(negate(_.isNil(requestMethod) || !_.isString(url)), 'requestMethod and url must be set')
                bind(RequestMethod[requestMethod!] as RequestMethodName, `${controller.prefix}${url as string}`, (request, response) => {
                    const { handler, params, paramsCount } = route
                    guard(negate(_.isNil(handler)), 'handler must be set')
                    const handlerParams: any[] = new Array(paramsCount).fill(undefined)
                    for(const { index, getter, type } of params) {
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
            })
        })
        return this
    }

    bindControllers(controllers: Object[]) {
        controllers.map(controller => {
            const storageController = storage.getController(controller.constructor.name)
            if (storageController) {
                storageController.routes.map(route => { route.handler = controller[route.name].bind(controller) })
            }
        })
        return this
    }
}
