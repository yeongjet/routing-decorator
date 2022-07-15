import { createHttpRouteParamDecorator } from '../decorator-generator.js'
import { InjectParamType } from '../common'

export const Request = createHttpRouteParamDecorator(InjectParamType.REQUEST)
export const Response = createHttpRouteParamDecorator(InjectParamType.RESPONSE)
export const Body = createHttpRouteParamDecorator(InjectParamType.BODY)
export const Query = createHttpRouteParamDecorator(InjectParamType.QUERY)
export const Param = createHttpRouteParamDecorator(InjectParamType.PARAM)
export const Header = createHttpRouteParamDecorator(InjectParamType.HEADER)
export const Session = createHttpRouteParamDecorator(InjectParamType.SESSION)
export const Host = createHttpRouteParamDecorator(InjectParamType.HOST)
export const IP = createHttpRouteParamDecorator(InjectParamType.IP)
