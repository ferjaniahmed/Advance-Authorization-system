import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, BookDocument } from './entities/book.schema';
import { Model } from 'mongoose';
import { BookEntity } from './entities/book.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';

describe('booksService', () => {
  let service: BooksService;
  let model : Model<BookDocument>

  const mockbook : BookEntity = {
    _id: "66548d977518b87d6f89cb7f",
    name: "bock1",
    image: "image1",
    authorId: "66548d2032db18e0ec8d4cf8",
  }
  const bookModelMock = {
    create : jest.fn(),
    find : jest.fn(),
    findById : jest.fn(),
    findByIdAndUpdate : jest.fn(),
    findByIdAndDelete : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService , {
        provide : getModelToken(Book.name),
        useValue :bookModelMock
      }],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name)) 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe("findAll",()=>{

    it("should return all books" , async ()=>{
      jest.spyOn(model , "find").mockResolvedValue([mockbook])
      const result = await service.findAll()

      expect(result).toEqual([mockbook])
      expect(model.find).toHaveBeenCalled()
    })

    it("should throw NotFoundException" , async ()=>{
      jest.spyOn(model , "find").mockResolvedValue([])
      

      await expect(service.findAll()).rejects.toThrow(new NotFoundException("we dont have books yet!!"))
      expect(model.find).toHaveBeenCalled()
    })
  })

  describe("findById" , ()=>{

    it("should return book" , async ()=>{

      jest.spyOn(model, "findById").mockResolvedValue(mockbook)

      const result = await service.findOne(mockbook._id)
      expect(result).toEqual(mockbook)
      expect(model.findById).toHaveBeenCalledWith(mockbook._id)

    })

    it("should throw NotFoundException" , async ()=>{
      jest.spyOn(model, "findById").mockRejectedValue(new NotFoundException(`we dont have book of ${mockbook._id} ID`))

      await expect(service.findOne(mockbook._id)).rejects.toThrow(NotFoundException)
      expect(model.findById).toHaveBeenCalledWith(mockbook._id)
    })

    
    it("should throw BadRequestException" , async ()=>{
      const invalidId = 'invalid-id'
      await expect(service.findOne(invalidId)).rejects.toThrow(new BadRequestException("invalid book ID"))
    })
  })

  describe("create" , ()=>{

    const book : CreateBookDto = {
      name: "bock1",
      image: "image1",
      authorId: "66548d2032db18e0ec8d4cf8",

    }
    it("should create a book", async ()=>{
      jest.spyOn(model , "create").mockResolvedValue(mockbook as any) 

      const  result = await service.create(book)
      expect(result).toEqual(mockbook)
      expect(model.create).toHaveBeenCalled() 
    })

    it("should throw BadRequestException" , async ()=>{

      jest.spyOn(model , "create").mockRejectedValue(new BadRequestException("check your informations")) 

   
      await expect(service.create(book)).rejects.toThrow(BadRequestException)
      expect(model.create).toHaveBeenCalled() 
    })
  })

  describe("update" , ()=>{
    const updatedbook = {
      _id: '665322bb9354d3960b7016f1',
      bookname: 'ferjani',
      email: 'ahmed@gmail.com',
      password  : "54321",
      role: ["admin"]
    }
    it("should update book" , async ()=>{
  
      jest.spyOn(model , "findByIdAndUpdate").mockResolvedValue(updatedbook)

      const result = await service.update(mockbook._id , updatedbook)
      expect(result).toEqual(updatedbook),
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockbook._id , updatedbook) 
    })
    it("should throw BadRequestException" ,async ()=>{
      const invalidId = "invalid-ID"
      jest.spyOn(model , "findByIdAndUpdate").mockRejectedValue(new BadRequestException("invalid book ID"))
      
      await expect(service.update(invalidId , updatedbook)).rejects.toThrow(BadRequestException)
    })

  })

  describe("delete", ()=>{
    it("should delete book" , async ()=>{
      jest.spyOn(model , "findByIdAndDelete").mockResolvedValue(mockbook)

      const result = await service.remove(mockbook._id)
      expect(result).toEqual(mockbook),
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockbook._id) 
    }) 

    it("should throw BadRequestException" , async ()=>{
      const invalidId = "invalid-ID"
      jest.spyOn(model , "findByIdAndDelete").mockRejectedValue(new BadRequestException("invalid book ID"))

      await expect(service.remove(invalidId)).rejects.toThrow(BadRequestException)
    })
  })

});
