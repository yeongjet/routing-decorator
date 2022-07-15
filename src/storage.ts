import _ from 'lodash'
import { Storage, Controller, Route, HttpMethod, Param } from './common'
import { set } from './util'

const defaultController: Controller ={
    prefix: '',
    routes: []
}

const getDefaultRoute = (handlerName: string): Route => ({
    handlerName,
    params: []
})

const storage: Storage = {}

export const addParam = (key: string, handlerName: string, param: Param) => {
    set(storage, [[ key, defaultController ], 'routes', [ { handlerName }, getDefaultRoute(handlerName) ], 'params'], param)
}

export const addRoute = (key: string, route: Route) => {
    const { handlerName } = route
    set(storage, [[ key, defaultController ], 'routes', [ { handlerName }, getDefaultRoute(handlerName) ]], route)
}

export const setController = (key: string, value: Partial<Controller>) => {
    set(storage, [[ key, defaultController ]], value)
}

export const getControllers = () => Object.values(storage)
