import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Repository } from "typeorm";
import { CreatePatientDto } from "./dtos/create-patient.dto";
import { Patient } from "./entities/patient.entity";
import { Record } from "./entities/record.entity";

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
        @InjectRepository(Record)
        private recordRepository: Repository<Record>,
        @InjectRepository(Doctor)
        private doctorRepository: Repository<Doctor>,
        private readonly jwtService: JwtService
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

    async getPatientById(patientId: number, token: string) {
        const data = await this.jwtService.verifyAsync(token);

        const patient = await this.patientRepository.findOne({
            where: {
                id: patientId,
                doctor: data.id
            },
            relations: ['doctor']
        })
        if (!patient) {
            throw new NotFoundException('Hasta bulunamadı veya erişiminiz yok');
        }

        return patient;
    }

    async getPatients(token: string) {
        const data = await this.jwtService.verifyAsync(token);

        return this.patientRepository.find({
            where: {
                doctor: data.id
            },
            relations: ['doctor']
        });
    }

    async addRecordForPatient(files: Array<Express.Multer.File>, id: number) {
        const patient = await this.patientRepository.findOne(id);
        if (!patient) {
            throw new BadRequestException(["Hasta bulunamadı"]);
        }

        for (const file of files) {
            await this.recordRepository.save({
                label: file.fieldname,
                url: file.path,
                patient: patient
            });
        }
    }

    async getRecords(id: number) {
        const patient = await this.patientRepository.findOne(id);
        if (!patient) {
            throw new BadRequestException(["Hasta bulunamadı"]);
        }

        return this.recordRepository.find({
            where: {
                patient: patient
            },
            order: { createdAt: 'DESC' }
        });
    }
}