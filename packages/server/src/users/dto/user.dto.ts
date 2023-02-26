//response 할때 dto
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../users.schema';

//dto계층간 데이터 교환을 하기 위해 사용하느 객체
//readonly에서는 password는 없애야 하기 때문에 picktype을 쓴다.
export class ReadOnlyUserDto extends PickType(User, ['loginid', 'name'] as const) {
  //몽구스에서 자동으로 아이디를 부여해준다.
  @ApiProperty({
    example: '12332112',
    description: 'id',
  })
  id: string;
}
