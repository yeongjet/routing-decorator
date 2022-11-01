import { storage } from '../storage'
import { addLeadingSlash, set } from '../util'
import { ClassDecoratorParams } from '../interface'

export function Controller (prefix = '') {
    return (...[ target ]: ClassDecoratorParams) => {
        set(storage, `controllers.${target.constructor.name}.prefix`, addLeadingSlash(prefix))
    }
}