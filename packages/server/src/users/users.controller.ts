import { AuthService } from '../auth/auth.service';
import { UserRequestDto } from './dto/users.request.dto';
import {
  Body,
  Delete,
  Param,
  Put,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { UploadService } from 'src/uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly uploadService: UploadService,
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
  async logIn(@Body() data: LoginRequestDto) {
    console.log('로그인 요청');
    return await this.authService.jwtLogIn(data);
  }

  //로그아웃은 필요가 없음 프론트에서 jwt 제거하면 필요가 없음

  @ApiOperation({ summary: '이미지 업로드' })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImg(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    //s3에 업로드
    const s3Object = await this.uploadService.uploadFileToS3('copy', file);
    //s3에 저장된 url 얻기
    const imgUrl = this.uploadService.getAwsS3FileUrl(s3Object.key);
    // 유저 정보 update
    const user = await this.usersService.uploadImg(req.user.id, imgUrl);
    return Object.assign({
      statuscode: 200,
      message: '이미지 업로드 성공',
      user,
    });
  }
  @ApiOperation({ summary: '이미지 삭제 ' })
  @UseGuards(JwtAuthGuard)
  @Delete('/:imageUrl')
  async deleteImg(@Req() req: any, @Param('imageUrl') imageUrl: string) {
    const userId = req.user.id;
    const key = imageUrl.substring(imageUrl.indexOf('copy'));
    console.log(imageUrl);

    // Delete the image from S3
    await this.uploadService.deleteS3Object(key);

    // Update the user's information
    const user = await this.usersService.deleteImg(userId, null);

    return {
      statusCode: 200,
      message: '이미지 삭제 성공',
      user,
    };
  }
}
