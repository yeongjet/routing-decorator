import _ from 'lodash'

export const addLeadingSlash = (path: string = '/') => {
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

export const isValidKey = (name?: string) => _.isString(name) && name.length > 0

export const set = (target: any, keys: (string | Record<string, any>)[], values: any[]) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        let parent: any
        let parentKey
        guard(_.isString(key) || _.isObject(key), `the key:${key}(${typeof key}) of ${target}(${typeof target}) is invalid`)
        if (_.isString(key)) {
            parentKey = key
            if (_.isUndefined(target[key]) && values[i]) {
                target[key] = values[i]
            }
            parent = target
            target = target[key]
        } else if (_.isObject(key)) {
            const subKey = Object.keys(key)[0]
            guard(
                _.isString(subKey) && _.isObject(key[subKey]),
                `the key:${JSON.stringify(key)} of ${target}(${typeof target}) is invalid`
            )
            target = target[subKey]
            guard(_.isArray(target), `the target:${target} must be array`)
            let item = target.find(n => isContain(n, key[subKey]))
            if (_.isUndefined(item) && values[i]) {
                item = values[i]
                target.push(item)
            }
            parent = target
            target = item
        }
        guard(negate(_.isUndefined(target)), 'target is not found')
        if (i === keys.length - 1) {
            if (_.isArray(target)) {
                target.push(values[i])
            } else if (_.isObject(target)) {
                Object.assign(target, values[i + 1])
            } else if(isValidKey(parentKey)) {
                parent[parentKey] = values[i]
            }
        }
    }
}