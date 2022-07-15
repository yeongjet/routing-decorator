import { createHttpMethodDecorator } from '../decorator-generator.js'
import { HttpMethod } from '../common'

export const Post = createHttpMethodDecorator(HttpMethod.POST)
export const Get = createHttpMethodDecorator(HttpMethod.GET)
export const Delete = createHttpMethodDecorator(HttpMethod.DELETE)
export const Put = createHttpMethodDecorator(HttpMethod.PUT)
export const Patch = createHttpMethodDecorator(HttpMethod.PATCH)
export const Options = createHttpMethodDecorator(HttpMethod.OPTIONS)
export const Head = createHttpMethodDecorator(HttpMethod.HEAD)
export const All = createHttpMethodDecorator(HttpMethod.ALL)
