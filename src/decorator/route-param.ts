import { createParamDecorator } from '../builder'
import { ParamSource } from '../common'

export const Request = createParamDecorator(ParamSource.REQUEST)
export const Response = createParamDecorator(ParamSource.RESPONSE)
export const Body = createParamDecorator(ParamSource.BODY)
export const Query = createParamDecorator(ParamSource.QUERY)
export const Param = createParamDecorator(ParamSource.PARAM)
export const Headers = createParamDecorator(ParamSource.HEADERS)
export const Session = createParamDecorator(ParamSource.SESSION)
export const Host = createParamDecorator(ParamSource.HOST)
export const IP = createParamDecorator(ParamSource.IP)
