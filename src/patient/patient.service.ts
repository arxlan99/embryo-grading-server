import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Repository } from "typeorm";
import { CreatePatientDto } from "./dtos/create-patient.dto";
import { Patient } from "./entities/patient.entity";

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
        @InjectRepository(Doctor)
        private doctorRepository: Repository<Doctor>,
    ) { }

    async createPatient(createPatientDto: CreatePatientDto) {
        const doctor = await this.doctorRepository.findOne({ id: createPatientDto.doctorId });
        if (!doctor) return new BadRequestException(['Doktor bulunamadı']);

        return this.patientRepository.save({
            firstName: createPatientDto.firstName,
            lastName: createPatientDto.lastName,
            birthDate: createPatientDto.birthDate,
            phoneNumber: createPatientDto.phoneNumber,
            tcNo: createPatientDto.tcNo,
            doctor
        });
    }

    async getPatients(){
        return this.patientRepository.find({ relations: ['doctor'] });
    }
}