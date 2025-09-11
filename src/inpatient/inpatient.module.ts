import { Module } from '@nestjs/common';
import { InpatientService } from './inpatient.service';
import { InpatientController } from './inpatient.controller';

@Module({
  controllers: [InpatientController],
  providers: [InpatientService],
})
export class InpatientModule {}
