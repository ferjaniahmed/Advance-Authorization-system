import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ){}



    async validateUser(username:string , pass : string){
        const user : UserEntity = await (this.usersService.findByUsername(username) as unknown)as UserEntity;
        if (user?.password === pass) {
            const { password, ...result } = user;
            return result;   
        }else{
            throw new UnauthorizedException("invalid username or password");
        }
    }

    async login(user : UserEntity){
        const payload = { _id: user._id, username: user.username , role : user.role};
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
    }
}
