import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Param, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/doctor/guards/auth.guard";
import { CreatePatientDto } from "./dtos/create-patient.dto";
import { PatientService } from "./patient.service";
import { Response, Request } from 'express';

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
    getAll(@Req() req: Request) {
        const token = req.cookies.jwt;
        return this.patientService.getPatients(token);
    }

    @Get(':id')
    @HttpCode(200)
    getPatientById(@Param() params,  @Req() req: Request) {
        const token = req.cookies.jwt;
        return this.patientService.getPatientById(params.id, token);
    }
}