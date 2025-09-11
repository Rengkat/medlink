import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { VisitsModule } from './visits/visits.module';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';
import { BillingModule } from './billing/billing.module';
import { InpatientModule } from './inpatient/inpatient.module';
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [UserModule, PatientsModule, AppointmentsModule, VisitsModule, AuthModule, RecordsModule, BillingModule, InpatientModule, TelemedicineModule, AdminModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
