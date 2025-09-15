import { Module } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { TelemedicineController } from './telemedicine.controller';
import { ChatGateway } from './chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telemedicine } from './entities/telemedicine.entity';

@Module({
  controllers: [TelemedicineController],
  providers: [TelemedicineService, ChatGateway],
  imports: [TypeOrmModule.forFeature([Telemedicine])],
  exports: [TelemedicineService],
})
export class TelemedicineModule {}
