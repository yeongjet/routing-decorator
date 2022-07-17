import { addLeadingSlash } from '../util'
import { createControllerDecorator } from '../builder'

export function Controller (prefix = ''): ClassDecorator {
    return createControllerDecorator(addLeadingSlash(prefix))
}