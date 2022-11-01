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

export const set = (obj: any, path: string, item: any) => {
    const value = _.get(obj, path)
    if (_.isArray(value)) {
        value.push(...item)
    } else {
        _.set(obj, path, item)
    }
}