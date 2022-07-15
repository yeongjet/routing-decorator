import { HTTP_ROUTE_PATH_METADATA } from '../common/constant/index.js'
import { addLeadingSlash } from '../util.js'

export function Controller (prefix = ''): ClassDecorator {
    return (target: Object) => {
        Reflect.defineMetadata(HTTP_ROUTE_PATH_METADATA, addLeadingSlash(prefix), target)
    }
}