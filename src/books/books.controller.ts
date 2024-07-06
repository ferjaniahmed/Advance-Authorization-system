import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CheckPolicies } from 'src/decorators/check-policies .decorator';
import { Actions } from 'src/casl/actions';
import { BookEntity } from './entities/book.entity';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Create , BookEntity))
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Read , BookEntity))
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Read , BookEntity))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  
  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Update , BookEntity))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  
  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Delete , BookEntity))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
