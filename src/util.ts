import _ from 'lodash'

export const addLeadingSlash = (path: string) => {
    if (path.charAt(0) !== '/' && path.length > 0) {
        return `/${path}`
    }
    return path
}

export const guard = (condition: boolean, message: string) => {
    if (!condition) {
        throw new Error(message)
    }
}

export const negate = (value: boolean) => !value

export const isContain = (first: object, second: object) => {
    for (const key of Object.keys(second)) {
        if (first[key] !== second[key]) {
            return false
        }
    }
    return true
}

export const get = (target: object, ...keys: (string | Record<string, string | number | boolean>)[]) => {
    for (const key of keys) {
        if (_.isString(key)) {
            target = target[key]
        } else if (_.isArray(target) && _.isObject(key)) {
            target = target.find(n => isContain(n, key))
        } else {
            return {}
        }
        if (_.isUndefined(target)) {
            return {}
        }
    }
    return target
}

export const set = (
    target: object,
    params: ([key: string | Record<string, any>, initial?: any] | string)[],
    value: object | any
) => {
    for (let i = 0; i < params.length; i++) {
        const param = params[i]
        let parent: any = param
        let parentKey
        guard(_.isString(param) || _.isArray(param), `the index:${i} of params:${params} is invalid`)
        if (_.isString(param)) {
            parent = target
            parentKey = param
            target = target[param]
        } else if (_.isArray(param)) {
            const [key, initial] = param
            guard(
                _.isString(key) || (_.isArray(target) && _.isObject(key)),
                `the key:${key}(${typeof key}) of ${target}(${typeof target}) is invalid`
            )
            if (_.isString(key)) {
                parentKey = key
                if (_.isUndefined(target[key]) && initial) {
                    target[key] = initial
                }
                parent = target
                target = target[key]
            } else if (_.isArray(target) && _.isObject(key)) {
                if (_.isEmpty(target) && initial) {
                    target.push(initial)
                }
                parent = target
                target = target.find(n => isContain(n, key))
            }
        }
        guard(negate(_.isUndefined(target)), 'target is not found')
        if (i === params.length - 1) {
            if (_.isArray(target)) {
                target.push(value)
            } else if (_.isObject(target)) {
                Object.assign(target, value)
            } else {
                guard(_.isString(parentKey) && parentKey.length > 0, 'parentKey is not found as setting constant value')
                parent[parentKey] = value
            }
        }
    }
}
