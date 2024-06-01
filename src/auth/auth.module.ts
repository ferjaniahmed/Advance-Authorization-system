import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports :[
    UsersModule,
    JwtModule.register({
      secret : "SHOULD BE SECRET",
      signOptions: { expiresIn: '60s' }
    })
    ],
  controllers: [AuthController],
  providers: [AuthService , LocalStrategy , JwtStrategy],
  exports : [AuthService]
})
export class AuthModule {}
