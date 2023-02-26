import { Module } from '@nestjs/common';
import { UploadService } from './uploads.service';

@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadsModule {}
