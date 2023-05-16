import { ParameterBindingType } from '../storage'
import { createParameterBindingDecorator } from '../builder'

export const Request = createParameterBindingDecorator(ParameterBindingType.REQUEST)
export const Response = createParameterBindingDecorator(ParameterBindingType.RESPONSE)
export const Body = createParameterBindingDecorator(ParameterBindingType.BODY)
export const Query = createParameterBindingDecorator(ParameterBindingType.QUERY)
export const Param = createParameterBindingDecorator(ParameterBindingType.PARAM)
export const Headers = createParameterBindingDecorator(ParameterBindingType.HEADERS)
export const Session = createParameterBindingDecorator(ParameterBindingType.SESSION)
export const Host = createParameterBindingDecorator(ParameterBindingType.HOST)
export const IP = createParameterBindingDecorator(ParameterBindingType.IP)
