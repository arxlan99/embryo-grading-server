import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
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
