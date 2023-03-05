import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { LoginRequestDto } from './dto/login.request.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService) {}
  async jwtLogIn(data: LoginRequestDto) {
    const { loginid, password } = data;

    //해당하는 아이디가 있는지 체크 로그인 유효성 검사 체크
    const user = await this.usersRepository.findUserByLoginId(loginid);
    if (!user) {
      throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요');
    }

    //password가 일치한지 검사하기
    const isPasswordValidated: boolean = await bcrypt.compare(password, user.password);

    if (!isPasswordValidated) {
      throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요');
    }

    //서명이 되어 토큰이 발급된다.
    const payload = { loginid: loginid, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
