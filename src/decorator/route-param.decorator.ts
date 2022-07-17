import { createParamDecorator } from '../builder'
import { InjectParamType } from '../common'

export const Request = createParamDecorator(InjectParamType.REQUEST)
export const Response = createParamDecorator(InjectParamType.RESPONSE)
export const Body = createParamDecorator(InjectParamType.BODY)
export const Query = createParamDecorator(InjectParamType.QUERY)
export const Param = createParamDecorator(InjectParamType.PARAM)
export const Headers = createParamDecorator(InjectParamType.HEADERS)
export const Session = createParamDecorator(InjectParamType.SESSION)
export const Host = createParamDecorator(InjectParamType.HOST)
export const IP = createParamDecorator(InjectParamType.IP)
