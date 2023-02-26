import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
//db에서 하나 만들어줄때 타임스탬프를 찍어준다.
const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'joohwan1234',
    description: 'loginid',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  loginid: string;

  @ApiProperty({
    example: 'joohwan',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '12345',
    description: 'password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
  //이미지는 안넣을수도 있기에 required 안넣는다. -> 디폴트값이 false 임
  @Prop()
  @IsString()
  imgUrls: string[];
  //언제 업데이트 했는지 사용자는 알 필요없고 백엔드만 필요하다.
  readonly readOnlyData: { id: string; loginid: string; name: string; imgUrls: string[] };
}

export const UserSchema = SchemaFactory.createForClass(User);

//클라이언트에서 비밀번호를 못보게 해야함 숨길수 있는 기능을 제공한다.
//사용자가 볼 것들만 필터링 한다.
UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    loginid: this.loginid,
    name: this.name,
  };
});
