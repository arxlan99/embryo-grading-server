import {
    Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Param,
    Post, Req, UploadedFiles, UseGuards, UseInterceptors
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/doctor/guards/auth.guard";
import { CreatePatientDto } from "./dtos/create-patient.dto";
import { PatientService } from "./patient.service";
import { Response, Request } from 'express';
import { AnyFilesInterceptor, MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export const storage = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@ApiTags('patients')
@Controller('patients')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Post()
    @HttpCode(201)
    async createPatient(@Req() req: Request, @Body() createPatientDto: CreatePatientDto) {
        const token = req.cookies.jwt;
        const patient = await this.patientService.createPatient(createPatientDto, token);

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
    getPatientById(@Param() params, @Req() req: Request) {
        const token = req.cookies.jwt;
        
        return this.patientService.getPatientById(params.id, token);
    }

    @Get(':id/records')
    @HttpCode(200)
    getPatientRecords(@Param() params, @Req() req: Request) {
        return this.patientService.getRecords(params.id);
    }

    @Post(':id/records')
    @HttpCode(200)
    @UseInterceptors(AnyFilesInterceptor(storage))
    async addRecordsForPatient(@Param() params, @UploadedFiles() files: Array<Express.Multer.File>) {
        await this.patientService.addRecordForPatient(files, params.id);
        
        return files;
    }
}