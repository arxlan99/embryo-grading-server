import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/doctor/guards/auth.guard";
import { CreatePatientDto } from "./dtos/create-patient.dto";
import { PatientService } from "./patient.service";

@ApiTags('patients')
@Controller('patients')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Post()
    @HttpCode(201)
    async createPatient(@Body() createPatientDto: CreatePatientDto) {
        const patient = await this.patientService.createPatient(createPatientDto);

        return patient;
    }

    @Get()
    @HttpCode(200)
    getAll() {
        return this.patientService.getPatients();
    }
}