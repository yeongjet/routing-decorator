import _ from 'lodash'
import { Storage, Property } from './common'
import { set } from './util'

const getDefaultController = (): Storage.Controller => ({
    prefix: '',
    routes: []
})

const getDefaultRoute = (routeName: Property): Storage.Route => ({
    name: routeName,
    url: '',
    params: [],
    paramsCount: 0
})

export const storage: Storage = {}

export const setParam = (controllerName: string, routeName: Property, param: Partial<Storage.Param>) => {
    set(storage, [ controllerName, { routes: { name: routeName }}, 'params' ], [ getDefaultController(), getDefaultRoute(routeName), param ])
}

export const setRoute = (controllerName: string, routeName: Property, route: Partial<Storage.Route>) => {
    set(storage, [ controllerName, { routes: { name: routeName }} ], [ getDefaultController(), getDefaultRoute(routeName), route ])
}

export const setController = (controllerName: string, value: Partial<Storage.Controller>) => {
    set(storage, [ controllerName ], [ getDefaultController(), value ])
}

export const getRoute = (controllerName: string, routeName: Property) => storage[controllerName].routes.find(n => n.name === routeName)

export const getController = (controllerName: string) => storage[controllerName]

export const getControllers = () => Object.values(storage)

export const getStorage = () => storage