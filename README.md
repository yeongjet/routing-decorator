A NodeJS backend framework tools that provides decorators for routing binding. Support a great many framework like Koa, Fastify, Restify...

# Install
npm i routing-decorator

# Usage

* Koa:
```ts
// user-address.controller.ts:
import { Post, Body, Request, Controller } from 'routing-decorator'

@Controller('user/address')
export class UserAddressController {
    @Post('add')
    async addUserAddress(@Request() request: Request, @Body() dto: AddUserAddressDto) {
        ...
    }
}

// main.ts:
import Koa from 'koa'
import findMyWay from 'find-my-way'
import { RoutingDecorator } from 'routing-decorator'
import { UserAddressController } from './user-address.controller'

const router = findMyWay()
const routingDecorator = new RoutingDecorator()
    .bindRouter(router)
    .bindControllers([UserAddressController])
const koa = new Koa()
koa.use(router)

```

# Decorators
* @Request
* @Response
* @Body
* @Query
* @Param
* @Headers
* @Session
* @Host
* @IP

# Parameters of constructor:
* `onBindToInjectedParameter`: executed before bind to handler paramters, you can do request params checking here.
* `onRouteFound`: executed as route was found.
* `beforeHandlerExecute`: executed before handler executing.
