import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './entities/book.schema';

@Module({
  imports : [MongooseModule.forFeature([{name : Book.name , schema : BookSchema}])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
