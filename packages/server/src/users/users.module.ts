import { User, UserSchema } from './users.schema';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UploadService } from 'src/uploads/uploads.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UploadService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
