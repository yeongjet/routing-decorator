import { ParameterBinding } from '../storage'
import { createParameterBindingDecorator } from '../builder'

export const Request = createParameterBindingDecorator(ParameterBinding.REQUEST)
export const Response = createParameterBindingDecorator(ParameterBinding.RESPONSE)
export const Body = createParameterBindingDecorator(ParameterBinding.BODY)
export const Query = createParameterBindingDecorator(ParameterBinding.QUERY)
export const Param = createParameterBindingDecorator(ParameterBinding.PARAM)
export const Headers = createParameterBindingDecorator(ParameterBinding.HEADERS)
export const Session = createParameterBindingDecorator(ParameterBinding.SESSION)
export const Host = createParameterBindingDecorator(ParameterBinding.HOST)
export const IP = createParameterBindingDecorator(ParameterBinding.IP)
