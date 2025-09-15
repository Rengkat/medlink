import { Module } from '@nestjs/common';
import { InpatientService } from './inpatient.service';
import { InpatientController } from './inpatient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inpatient } from './entities/inpatient.entity';

@Module({
  controllers: [InpatientController],
  providers: [InpatientService],
  exports: [InpatientService],
  imports: [TypeOrmModule.forFeature([Inpatient])],
})
export class InpatientModule {}
