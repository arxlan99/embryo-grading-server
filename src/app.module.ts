import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { ConfigModule } from '@nestjs/config';
import { Doctor } from './doctor/entities/doctor.entity';
import { Patient } from './patient/entities/patient.entity';
import { Record } from './patient/entities/record.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: "EmbryoGradingDb",
      name: "default",
      username: "qkdrenjz",
      password: "7NEcuRohFqUjqWpiIoHWD2UrxLSw7x9R",
      type: "postgres",
      url: "postgres://qkdrenjz:7NEcuRohFqUjqWpiIoHWD2UrxLSw7x9R@castor.db.elephantsql.com/qkdrenjz",
      synchronize: true,
      entities: [Doctor, Patient, Record]
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    DoctorModule,
    PatientModule
  ],
  exports: [JwtModule],
})
export class AppModule { }
