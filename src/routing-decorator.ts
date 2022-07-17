import { guard, negate } from './util'
import { RequestMethod, RequestMethodName } from './common'
import { getControllers } from './storage'
import _ from 'lodash'

export const bind = (bindRouter: (requestMethod: RequestMethodName, url: string, handler: (request: any, res: any) => void) => void ) => {
    getControllers().map(controller => {
        controller.routes.map(route => {
            const { requestMethod, url, handler, injectParams, handlerParamsType } = route
            guard(negate(_.isNil(requestMethod) || !_.isString(url)), 'requestMethod and url must be set')
            const paramCount = handlerParamsType.length
            bindRouter(RequestMethod[requestMethod!] as RequestMethodName, `${controller.prefix}${url as string}`, (request, response) => {
                if (!paramCount) {
                    return handler.apply(controller, [ request, response ])
                }
                const handlerParams: any[] = new Array(paramCount).fill(undefined)
                for(const { index, getter } of injectParams) {
                    const value = getter(request, response) || {}
                    handlerParams[index] = value
                }
                return handler.apply(controller, handlerParams)
            })
        })
    })
}
