import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UploadService } from 'src/uploads/uploads.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';

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
