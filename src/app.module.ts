import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule,MongooseModule.forRoot("mongodb://127.0.0.1:27017/authorization-system")],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
