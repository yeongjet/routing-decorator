import { RequestMethod } from '../storage'
import { createRequestMethodDecorator } from '../builder'

export const Post = createRequestMethodDecorator(RequestMethod.POST)
export const Get = createRequestMethodDecorator(RequestMethod.GET)
export const Delete = createRequestMethodDecorator(RequestMethod.DELETE)
export const Put = createRequestMethodDecorator(RequestMethod.PUT)
export const Patch = createRequestMethodDecorator(RequestMethod.PATCH)
export const Options = createRequestMethodDecorator(RequestMethod.OPTIONS)
export const Head = createRequestMethodDecorator(RequestMethod.HEAD)
