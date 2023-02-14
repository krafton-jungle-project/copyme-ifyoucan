import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//auth가드는 스트래티치 바로 실행해주는 기능이 있음

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
