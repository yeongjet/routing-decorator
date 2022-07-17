import { Post, Controller, Body, Request, Headers } from '../../../src'

@Controller('user')
export class ControllerA {
    @Post('a')
    get(@Body() body, @Request() request, @Headers('content-type') headers) {
        const sd = request.body
        console.log('hello' + JSON.stringify(body))
        return 'ok'
    }
}