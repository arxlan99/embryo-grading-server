import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorModule } from 'src/doctor/doctor.module';
import { Patient } from './entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Patient]),
        forwardRef(() => DoctorModule)
    ],
    controllers: [PatientController],
    providers: [PatientService]
})
export class PatientModule { }