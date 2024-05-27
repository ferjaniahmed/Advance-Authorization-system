import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Book, BookDocument } from './entities/book.schema';

@Injectable()
export class BooksService {

  constructor(@InjectModel(Book.name) private bookDocument : Model<BookDocument> ){}

  async create(createBookDto: CreateBookDto) {
    try{
      return await this.bookDocument.create(createBookDto);
    }catch{
      throw new BadRequestException("check your informations")
    }
  }

  async findAll() {
    let books  : BookDocument[]
    try{
      books = await this.bookDocument.find() 

    }catch{
      throw new HttpException("server error" , 500)
    }    
    if(books.length == 0){
      throw new NotFoundException("we dont have books yet!!")
    }else{
      return books
    }
  }

  async findOne(id: string) {
    if(!isValidObjectId(id)){
      throw new BadRequestException("invalid book ID") 
    }
    try{
      return await this.bookDocument.findById(id) 
     }catch{
      throw new NotFoundException(`we dont have book of ${id} ID`)
     }
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    if(!isValidObjectId(id)){
      throw new BadRequestException("invalid book ID") 
    }
    try{
      return await this.bookDocument.findByIdAndUpdate(id , updateBookDto) 
     }catch{
       throw new NotFoundException(`we dont have book of ${id} ID for the update`)
     }
  }

  async remove(id: string) {
    if(!isValidObjectId(id)){
      throw new BadRequestException("invalid book ID") 
    }
    try{
      return await this.bookDocument.findByIdAndDelete(id) 
     }catch{
      throw new NotFoundException(`we dont have book of ${id} ID`)
     };
  }
}
