import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { find } from 'rxjs';
import { BookEntity } from './entities/book.entity';

describe('booksController', () => {
  let controller: BooksController;

  const mockbook : BookEntity = {
    _id: "66548d977518b87d6f89cb7f",
    name: "bock1",
    image: "image1",
    authorId: "66548d2032db18e0ec8d4cf8",
  }

  const bookServiceMock ={
    findAll: jest.fn().mockImplementation(()=>{
      return [mockbook]
    }),
    create : jest.fn().mockImplementation(()=>{
      return mockbook
    }),
    update : jest.fn().mockImplementation(()=>{
      return mockbook
    }),
    remove : jest.fn().mockImplementation(()=>{
      return mockbook
    }),
    findOne  : jest.fn().mockImplementation(()=>{
      return mockbook
    }),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{
        provide : BooksService,
        useValue : bookServiceMock
      }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("findAll" , ()=>{
    it("should return all books" , async ()=>{
      expect(await controller.findAll()).toEqual([mockbook])
      expect(bookServiceMock.findAll).toHaveBeenCalled() 
    })
   
  })
  describe("create" , ()=>{
    it("should create books" , async ()=>{
      const newBook : BookEntity = {
        name: "bock1",
        image: "image1",
        authorId: "66548d2032db18e0ec8d4cf8",
      }
      expect(await controller.create(newBook)).toEqual(mockbook)
      expect(bookServiceMock.create).toHaveBeenCalled() 
    })
   
  })

  describe("update" , ()=>{
    it("should update books" , async ()=>{
      expect(await controller.update(mockbook._id , mockbook)).toEqual(mockbook)
      expect(bookServiceMock.update).toHaveBeenCalled() 
    })
   
  })

  describe("remove" , ()=>{
    it("should remove books" , async ()=>{
      expect(await controller.remove(mockbook._id)).toEqual(mockbook)
      expect(bookServiceMock.remove).toHaveBeenCalled() 
    })
   
  })

  describe("findOne" , ()=>{
    it("should find one book" , async ()=>{
      expect(await controller.findOne(mockbook._id)).toEqual(mockbook)
      expect(bookServiceMock.findOne).toHaveBeenCalled() 
    })
   
  })
});
