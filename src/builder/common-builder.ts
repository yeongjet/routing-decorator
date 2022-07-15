import { InjectParamType } from '../common'

export const createParamGetter = (type: InjectParamType, key?: string) => (req, res, next) => {
    switch (type) {
        case InjectParamType.REQUEST:
            return req as any
        case InjectParamType.RESPONSE:
            return res as any
        case InjectParamType.BODY:
            return key && req.body ? req.body[key] : req.body
        case InjectParamType.PARAM:
            return key ? req.params[key] : req.params
        case InjectParamType.HOST:
            const hosts = req.hosts || {}
            return key ? hosts[key] : hosts
        case InjectParamType.QUERY:
            return key ? req.query[key] : req.query
        case InjectParamType.HEADER:
            return key ? req.headers[key.toLowerCase()] : req.headers
        case InjectParamType.SESSION:
            return req.session
        case InjectParamType.IP:
            return req.ip
        default:
            return null
    }
}

