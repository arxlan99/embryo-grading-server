import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from 'src/doctor/doctor.module';
import { Patient } from './entities/patient.entity';
import { Record } from './entities/record.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Record]),
    forwardRef(() => DoctorModule),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [TypeOrmModule],
})
export class PatientModule {}
