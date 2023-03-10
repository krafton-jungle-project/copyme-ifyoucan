import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRequestDto } from './dto/users.request.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async signUp(body: UserRequestDto) {
    const { loginid, name, password } = body;
    //중복 방지하자 (유효성 검사를 하자 )
    const isUserExist = await this.usersRepository.existsByLoginId(loginid);
    if (isUserExist) {
      throw new UnauthorizedException('이미 존재하는 아이디입니다.');
    }
    const isNicknameExist = await this.usersRepository.existsByNickname(name);
    if (isNicknameExist) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }
    //비밀번호 암호화를 하자 bycript=> hash를 해준다.(설치해야 함)
    const hashedPassword = await bcrypt.hash(password, 10);

    //본격적으로 저장을 하자
    const user = await this.usersRepository.create({
      loginid,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }

  async uploadImg(userId: string, imgUrl: string) {
    const user = await this.usersRepository.findUserByIdWithoutPassword(userId);
    if (!user) {
      throw new UnauthorizedException('해당 아이디의 유저를 찾을 수 없습니다.');
    }
    return await this.usersRepository.updateUserImg(userId, imgUrl);
  }

  async deleteImg(userId: string, key: string) {
    const user = await this.usersRepository.findUserByIdWithoutPassword(userId);
    if (!user) {
      throw new UnauthorizedException('해당 아이디의 유저를 찾을 수 없습니다.');
    }
    return await this.usersRepository.deleteUserImg(userId, key);
  }
}
