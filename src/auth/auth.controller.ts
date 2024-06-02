import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/auth-locale.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req){
       return await this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Request() req){
        return req.user
    }
}
