import { PickType } from '@nestjs/swagger';
import { User } from '../users.schema';

export class ImageRequestDto extends PickType(User, ['imgUrl'] as const) {}
