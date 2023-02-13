import { AuthService } from '../auth/auth.service';
import { UserRequestDto } from './dto/users.request.dto';
import { Body, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserDto } from './dto/user.dto';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from './users.schema';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 로그인한 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user: User) {
    return user.readOnlyData;
  }
  @ApiResponse({ status: 500, description: 'Sever Error ...' })
  @ApiResponse({ status: 200, description: '성공!', type: ReadOnlyUserDto })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    console.log('로그인 요청');
    data = this.authService.jwtLogIn(data);
    console.log(data);
    return data;
  }

  //로그아웃은 필요가 없음 프론트에서 jwt 제거하면 필요가 없음

  // @ApiOperation({ summary: '이미지 업로드' })
  // @Post('upload/cats')
  // uploadCatImg() {
  //   return 'uploadImg';
  // }
}
