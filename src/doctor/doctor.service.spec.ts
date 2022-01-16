import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DoctorService } from './doctor.service';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { Doctor } from './entities/doctor.entity';

const doctorArray = [
  new Doctor(1, 'test1', 'a', 'test1@gmail.com', '123456'),
  new Doctor(2, 'test2', 'b', 'test2@gmail.com', '123456'),
  new Doctor(3, 'test3', 'c', 'test3@gmail.com', '123456'),
];

const doctor = async () =>
  new Doctor(
    1,
    'ismail',
    'kılıç',
    'ismail000728@gmail.com',
    await bcrypt.hash('123456', 12),
  );

describe('DoctorService', () => {
  let repo: Repository<Doctor>;
  let service: DoctorService;
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
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
          useValue: {
            find: jest.fn().mockResolvedValue(doctorArray),
            findOne: jest.fn().mockResolvedValue(await doctor()),
          },
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    repo = module.get<Repository<Doctor>>(getRepositoryToken(Doctor));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('getAll', () => {
    it('should return all doctors', async () => {
      const doctors = await service.getAll();
      expect(doctors).toBe(doctorArray);
      expect(doctors.length).toBe(3);
    });
  });

  describe('signIn', () => {
    it('should sign in with provided email and password', async () => {
      const spy = jest.spyOn(repo, 'findOne');

      const dto = new SignInDto();
      dto.email = 'ismail000728@gmail.com';
      dto.password = '123456';

      const res = await service.signIn(dto);

      let data = await jwtService.verifyAsync(res);

      expect(data.email).toEqual(dto.email);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('signUp', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
              expiresIn: 3600,
            },
          }),
        ],
        providers: [
          DoctorService,
          {
            provide: getRepositoryToken(Doctor),
            useValue: {
              findOne: jest.fn(),
              save: jest.fn().mockResolvedValue(await doctor()),
            },
          },
        ],
      }).compile();
      repo = module.get<Repository<Doctor>>(getRepositoryToken(Doctor));
      service = module.get<DoctorService>(DoctorService);
    });

    it('should create a new doctor', async () => {
      const dto = new SignUpDto();
      dto.email = 'ismail000728@gmail.com';
      dto.firstName = 'ismail';
      dto.lastName = 'kılıç';
      dto.password = '123456';

      const { newUser } = await service.signUp(dto);

      expect(newUser.email).toEqual(dto.email);
    });
  });
});
