import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
  imports: [TypeOrmModule.forFeature([Patient]), UserModule],
})
export class PatientsModule {}
