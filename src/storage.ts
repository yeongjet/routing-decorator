import _ from 'lodash'
import { Storage, Controller, Route, RequestMethod, Param, PartialRequired } from './common'
import { set } from './util'

const getDefaultController = (): Controller => ({
    prefix: '',
    routes: []
})

const getDefaultRoute = (handler: Function): Route => ({
    handler,
    injectParams: [],
    handlerParamsType: []
})

const storage: Storage = {}

export const setParam = (key: string, handler: Function, param: Param) => {
    set(storage, [[ key, getDefaultController() ], 'routes', [ { handler }, getDefaultRoute(handler) ], 'injectParams'], param)
}

export const setRoute = (key: string, route: PartialRequired<Route, 'handler'>) => {
    const { handler } = route
    set(storage, [[ key, getDefaultController() ], 'routes', [ { handler }, getDefaultRoute(handler) ]], route)
}

export const setController = (key: string, value: Partial<Controller>) => {
    set(storage, [[ key, getDefaultController() ]], value)
}

export const getControllers = () => Object.values(storage)
