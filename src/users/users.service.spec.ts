import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model, model } from 'mongoose';
import { UserEntity } from './entities/user.entity';
import { find } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let model : Model<UserDocument>

  const mockUser : UserEntity = {
    _id: '665322bb9354d3960b7016f1',
    username: 'ahmed',
    email: 'ahmed@gmail.com',
    password: '12345',
    role: ["admin"]
  }
  const userModelMock = {
    create : jest.fn(),
    find : jest.fn(),
    findById : jest.fn(),
    findByIdAndUpdate : jest.fn(),
    findByIdAndDelete : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService , {
        provide : getModelToken(User.name),
        useValue :userModelMock
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name)) 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe("findAll",()=>{

    it("should return all users" , async ()=>{
      jest.spyOn(model , "find").mockResolvedValue([mockUser])
      const result = await service.findAll()

      expect(result).toEqual([mockUser])
      expect(model.find).toHaveBeenCalled()
    })

    it("should throw NotFoundException" , async ()=>{
      jest.spyOn(model , "find").mockResolvedValue([])
      

      await expect(service.findAll()).rejects.toThrow(new NotFoundException("we dont have users yet!!"))
      expect(model.find).toHaveBeenCalled()
    })
  })

  describe("findById" , ()=>{

    it("should return user" , async ()=>{

      jest.spyOn(model, "findById").mockResolvedValue(mockUser)

      const result = await service.findOne(mockUser._id)
      expect(result).toEqual(mockUser)
      expect(model.findById).toHaveBeenCalledWith(mockUser._id)

    })

    it("should throw NotFoundException" , async ()=>{
      jest.spyOn(model, "findById").mockRejectedValue(new NotFoundException(`we dont have user of ${mockUser._id} ID`))

      await expect(service.findOne(mockUser._id)).rejects.toThrow(NotFoundException)
      expect(model.findById).toHaveBeenCalledWith(mockUser._id)
    })

    
    it("should throw BadRequestException" , async ()=>{
      const invalidId = 'invalid-id'
      await expect(service.findOne(invalidId)).rejects.toThrow(new BadRequestException("invalid user ID"))
    })
  })

  describe("create" , ()=>{

    const user : CreateUserDto = {
      username: 'ahmed',
      email: 'ahmed@gmail.com',
      password: '12345',
      role: ["admin"],

    }
    it("should create a user", async ()=>{
      jest.spyOn(model , "create").mockResolvedValue(mockUser as any) 

      const  result = await service.create(user)
      expect(result).toEqual(mockUser)
      expect(model.create).toHaveBeenCalled() 
    })

    it("should throw BadRequestException" , async ()=>{

      jest.spyOn(model , "create").mockRejectedValue(new BadRequestException("check your informations")) 

   
      await expect(service.create(user)).rejects.toThrow(BadRequestException)
      expect(model.create).toHaveBeenCalled() 
    })
  })

  describe("update" , ()=>{
    const updatedUser = {
      _id: '665322bb9354d3960b7016f1',
      username: 'ferjani',
      email: 'ahmed@gmail.com',
      password  : "54321",
      role: ["admin"]
    }
    it("should update user" , async ()=>{
  
      jest.spyOn(model , "findByIdAndUpdate").mockResolvedValue(updatedUser)

      const result = await service.update(mockUser._id , updatedUser)
      expect(result).toEqual(updatedUser),
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id , updatedUser) 
    })
    it("should throw BadRequestException" ,async ()=>{
      const invalidId = "invalid-ID"
      jest.spyOn(model , "findByIdAndUpdate").mockRejectedValue(new BadRequestException("invalid user ID"))
      
      await expect(service.update(invalidId , updatedUser)).rejects.toThrow(BadRequestException)
    })

  })

  describe("delete", ()=>{
    it("should delete user" , async ()=>{
      jest.spyOn(model , "findByIdAndDelete").mockResolvedValue(mockUser)

      const result = await service.remove(mockUser._id)
      expect(result).toEqual(mockUser),
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id) 
    }) 

    it("should throw BadRequestException" , async ()=>{
      const invalidId = "invalid-ID"
      jest.spyOn(model , "findByIdAndDelete").mockRejectedValue(new BadRequestException("invalid user ID"))

      await expect(service.remove(invalidId)).rejects.toThrow(BadRequestException)
    })
  })

});
