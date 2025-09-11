import { Module } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { TelemedicineController } from './telemedicine.controller';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  controllers: [TelemedicineController],
  providers: [TelemedicineService, ChatGateway],
})
export class TelemedicineModule {}
