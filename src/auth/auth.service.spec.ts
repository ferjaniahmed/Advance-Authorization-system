import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';


describe('AuthService', () => {
  let service: AuthService;
  let jwt : JwtService
  let userService : UsersService

  const mockUser  = {
    _id: '665322bb9354d3960b7016f1',
    username: 'ahmed',
    email: 'ahmed@gmail.com',
    password: '12345',
    role: ["admin"]
  }


  const userServiceMock = {
    findByUsername : jest.fn()
  }

  const jwtServiceMock = {
    signAsync : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService , 
        {
          provide : UsersService,
          useValue : userServiceMock
        },
        {
          provide : JwtService,
          useValue : jwtServiceMock
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    userService =module.get<UsersService>(UsersService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("login", ()=>{
    it("should return jwt token" , async ()=>{

      const payload = { _id: mockUser._id, username: mockUser.username , role : mockUser.role}
      jest.spyOn(jwt , "signAsync").mockResolvedValue("jwt-token")
    

      expect(await service.login(payload)).toEqual({
        access_token: "jwt-token"
      })
      expect(jwt.signAsync).toHaveBeenCalledWith(payload)
    })
  })
  
  describe("validateUser", ()=>{
    it("should return user" , async ()=>{
      const username ="ahmed"
      const pass = "12345"

      jest.spyOn(userService ,"findByUsername").mockImplementation(()=>{
        return mockUser as any
      })
      const user  = {
        _id: '665322bb9354d3960b7016f1',
        username: 'ahmed',
        email: 'ahmed@gmail.com',
        role: ["admin"]
      }
      expect(await service.validateUser(username , pass)).toEqual(user)
      expect(userService.findByUsername).toHaveBeenCalledWith(username)
    })
 
    it("should throw UnauthorizedException when putting invalid password" , async ()=>{
      const username ="ahmed"
      const pass = "invalid-pass"

      jest.spyOn(userService ,"findByUsername").mockImplementation(()=>{
        return mockUser as any
      })
      await expect(service.validateUser(username , pass))
      .rejects
      .toThrow('invalid username or password')
      expect(userService.findByUsername).toHaveBeenCalledWith(username)
    })

    it("should throw UnauthorizedException when the user notFound" , async ()=>{
      const username ="ahmed"
      const pass = "invalid-pass"

      jest.spyOn(userService ,"findByUsername").mockImplementation(()=>{
        return {} as any
      })
      await expect(service.validateUser(username , pass))
      .rejects
      .toThrow('invalid username or password')
      expect(userService.findByUsername).toHaveBeenCalledWith(username)
    })


  })
});
