import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { CaslModule } from 'src/casl/casl.module';


@Module({
  imports : [MongooseModule.forFeature([{name : User.name , schema :UserSchema}]) , CaslModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports : [UsersService]
})
export class UsersModule {}
