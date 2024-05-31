import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post("login")
    login(){

    }

    @Get("profile")
    getProfile(){

    }
}
