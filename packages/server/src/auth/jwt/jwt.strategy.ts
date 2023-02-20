import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/users/users.repository';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'process.env.JWT_SECRET',
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    //보안상 이유로 request user에 저장할때 패스워드 필드를 제외하고 저장하는 것이 좋다.
    const user = await this.usersRepository.findUserByIdWithoutPassword(payload.sub);
    if (user) {
      return user; //request user 에 user가 들어가게 된다.
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
