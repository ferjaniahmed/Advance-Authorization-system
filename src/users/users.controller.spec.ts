import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { find } from 'rxjs';
import { UserEntity } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser : UserEntity = {
    _id: '665322bb9354d3960b7016f1',
    username: 'ahmed',
    email: 'ahmed@gmail.com',
    password: '12345',
    role: ["admin"]
  }

  const userServiceMock ={
    findAll: jest.fn().mockImplementation(()=>{
      return [mockUser]
    }),
    create : jest.fn().mockImplementation(()=>{
      return mockUser
    }),
    update : jest.fn().mockImplementation(()=>{
      return mockUser
    }),
    remove : jest.fn().mockImplementation(()=>{
      return mockUser
    }),
    findOne  : jest.fn().mockImplementation(()=>{
      return mockUser
    }),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide : UsersService,
        useValue : userServiceMock
      }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("findAll" , ()=>{
    it("should return all users" , async ()=>{
      expect(await controller.findAll()).toEqual([mockUser])
      expect(userServiceMock.findAll).toHaveBeenCalled() 
    })
   
  })
  describe("create" , ()=>{
    it("should create users" , async ()=>{
      const newUser : UserEntity = {
        username: 'ahmed',
        email: 'ahmed@gmail.com',
        password: '12345',
        role: ["admin"]
      }
      expect(await controller.create(newUser)).toEqual(mockUser)
      expect(userServiceMock.create).toHaveBeenCalled() 
    })
   
  })

  describe("update" , ()=>{
    it("should update users" , async ()=>{
      expect(await controller.update(mockUser._id , mockUser)).toEqual(mockUser)
      expect(userServiceMock.update).toHaveBeenCalled() 
    })
   
  })

  describe("remove" , ()=>{
    it("should remove users" , async ()=>{
      expect(await controller.remove(mockUser._id)).toEqual(mockUser)
      expect(userServiceMock.remove).toHaveBeenCalled() 
    })
   
  })

  describe("findOne" , ()=>{
    it("should find one user" , async ()=>{
      expect(await controller.findOne(mockUser._id)).toEqual(mockUser)
      expect(userServiceMock.findOne).toHaveBeenCalled() 
    })
   
  })
});
