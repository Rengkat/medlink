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
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';

const ENV = process.env.NODE_ENV || 'development';

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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [databaseConfig, appConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get('database.type'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('database.synchronize'),
          autoLoadEntities: configService.get('database.autoLoadEntities'), // Fixed typo
        }) as any,
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
