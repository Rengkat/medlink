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
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoctorsModule } from './doctors/doctors.module';
import { StaffModule } from './staff/staff.module';
import { NursesModule } from './nurses/nurses.module';
import { PharmacistsModule } from './pharmacists/pharmacists.module';
import { LabTechniciansModule } from './lab-technicians/lab-technicians.module';
import { AccountantsModule } from './accountants/accountants.module';
@Module({
  imports: [
    UserModule,
    PatientsModule,
    AppointmentsModule,
    VisitsModule,
    AuthModule,
    RecordsModule,
    BillingModule,
    InpatientModule,
    TelemedicineModule,
    AdminModule,
    NotificationsModule,
    //For TypeORM
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      //Configure DB
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12345',
        database: 'MedLink',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    DoctorsModule,
    StaffModule,
    NursesModule,
    PharmacistsModule,
    LabTechniciansModule,
    AccountantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
