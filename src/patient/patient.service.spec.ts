import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dtos/create-patient.dto';

describe('PatientService', () => {
  let repo: Repository<Patient>;
  let service: PatientService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'secretKey',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    repo = module.get<Repository<Patient>>(getRepositoryToken(Patient));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createPatient', () => {
    it('should create a new patient', async () => {
      const dto = new CreatePatientDto();
      dto.firstName = 'Patient1';
      dto.lastName = 'lastname';
      dto.tcNo = '11111111111';
      dto.phoneNumber = '05555555555';
      dto.birthDate = new Date();
      const doctors = await service.createPatient(dto, '');
    });
  });
});
