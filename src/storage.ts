import _ from 'lodash'
import { Storage, Controller, Route, Param, PartialRequired } from './common'
import { set } from './util'

const getDefaultController = (): Controller => ({
    name: '',
    prefix: '',
    routes: []
})

const getDefaultRoute = (routeName: string, handler: Function): Route => ({
    name: routeName,
    handler,
    injectParams: [],
    handlerParamsType: []
})

export const storage: Storage = {}

export const setParam = (controllerName: string, handler: Function, param: Param) => {
    set(storage, [ controllerName, { routes: { handlerName: handler.name }}, 'injectParams' ], [ getDefaultController(), getDefaultRoute(handler.name, handler), param ])
}

export const setRoute = (controllerName: string, route: PartialRequired<Route, 'handler'>) => {
    const { handler } = route
    set(storage, [ controllerName, { routes: { handlerName: handler.name }} ], [ getDefaultController(), getDefaultRoute(handler.name, handler), route ])
}

export const setController = (controllerName: string, value: Partial<Controller>) => {
    set(storage, [ controllerName ], [ getDefaultController(), value ])
}

export const getRoute = (controllerName: string, routeName: string) => storage[controllerName].routes.find(n => n.name === routeName)

export const getController = (controllerName: string) => storage[controllerName]

export const getControllers = () => Object.values(storage)

export const getStorage = () => storage