import _ from 'lodash'
import { Storage, Controller, Route, Param, PartialRequired } from './common'
import { set } from './util'

const getDefaultController = (): Controller => ({
    name: '',
    prefix: '',
    routes: []
})

const getDefaultRoute = (handler: Function, handlerName: string): Route => ({
    handler,
    handlerName,
    injectParams: [],
    handlerParamsType: []
})

export const storage: Storage = {}

export const setParam = (key: string, handler: Function, param: Param) => {
    set(storage, [ key, { routes: { handlerName: handler.name }}, 'injectParams' ], [ getDefaultController(), getDefaultRoute(handler, handler.name), param ])
}

export const setRoute = (key: string, route: PartialRequired<Route, 'handler'>) => {
    const { handler } = route
    set(storage, [ key, { routes: { handlerName: handler.name }} ], [ getDefaultController(), getDefaultRoute(handler, handler.name), route ])
}

export const setController = (key: string, value: Partial<Controller>) => {
    set(storage, [ key ], [ getDefaultController(), value ])
}

export const getController = (key: string) => storage[key]

export const getControllers = () => Object.values(storage)

export const getStorage = () => storage