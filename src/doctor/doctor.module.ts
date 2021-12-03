import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor])
    ],
    controllers: [DoctorController],
    providers: [DoctorService]
  })
  export class DoctorModule { }
