import { bind } from '../../src'
import findMyWay from 'find-my-way'
import http from 'http'
import { ControllerA } from './controller'

;(async() => {
    console.log(ControllerA)
    const router = findMyWay()
    bind(router.on.bind(router))
    const server = http.createServer(router.lookup.bind(router))
    server.listen(3333)
})()