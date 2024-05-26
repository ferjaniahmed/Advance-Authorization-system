import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  static findAll() {
    throw new Error('Method not implemented.');
  }

  constructor(@InjectModel(User.name) private userDocument : Model<UserDocument>){}

  async create(createUserDto: CreateUserDto) {
    try{
      return await this.userDocument.create(createUserDto);
    }catch{
      throw new BadRequestException("check your informations")
    }
    
  }

  async findAll() {
    let users  : UserDocument[]
    try{
      users = await this.userDocument.find() 

    }catch{
      throw new HttpException("server error" , 500)
    }    
    if(users.length == 0){
      throw new NotFoundException("we dont have users yet!!")
    }else{
      return users
    }
  }

  async findOne(id: string) {
    if(!isValidObjectId(id)){
      throw new BadRequestException("invalid user ID") 
    }
    try{
      return await this.userDocument.findById(id) 
     }catch{
      throw new NotFoundException(`we dont have user of ${id} ID`)
     }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if(!isValidObjectId(id)){
      throw new BadRequestException("invalid user ID") 
    }
    try{
      return await this.userDocument.findByIdAndUpdate(id , updateUserDto) 
     }catch{
       throw new NotFoundException(`we dont have user of ${id} ID for the update`)
     }
  }

  async remove(id: string) {
    if(!isValidObjectId(id)){
      throw new BadRequestException("invalid user ID") 
    }
    try{
      return await this.userDocument.findByIdAndDelete(id) 
     }catch{
       throw new NotFoundException(`we dont have user of ${id} ID`)
     };
  }
}
