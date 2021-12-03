import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientModule } from 'src/patient/patient.module';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor]),
        forwardRef(() => PatientModule)
    ],
    controllers: [DoctorController],
    providers: [DoctorService],
    exports: [ TypeOrmModule]
  })
  export class DoctorModule { }
