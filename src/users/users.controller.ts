import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckPolicies } from 'src/decorators/check-policies .decorator';
import { Actions } from 'src/casl/actions';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  

  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Read , UserEntity))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

 
  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Read , UserEntity))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Update , UserEntity))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RoleGuard)
  @CheckPolicies((ability)=>ability.can(Actions.Delete , UserEntity))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
