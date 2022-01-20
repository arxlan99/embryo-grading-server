import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/signup.dto';
import { Doctor } from './entities/doctor.entity';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/signin.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { Patient } from 'src/patient/entities/patient.entity';
import { Record } from 'src/patient/entities/record.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    private jwtService: JwtService,
  ) { }

  async getAll() {
    const doctors = await this.doctorRepository.find();
    return doctors;
  }

  async getStats() {
    const doctorCount = await this.doctorRepository.count();
    const patientCount = await this.patientRepository.count();
    const recordCount = await this.recordRepository.count();

    return {
      doctorCount, patientCount, recordCount
    }
  }

  async signUp(signUpDto: SignUpDto) {
    // check email is already registered
    const existedUser = await this.doctorRepository.findOne({
      email: signUpDto.email,
    });
    if (existedUser) {
      throw new BadRequestException(['Bu email zaten kayıtlı']);
    }

    // hash password and save
    const hashedPassword = await bcrypt.hash(signUpDto.password, 12);
    const newUser = await this.doctorRepository.save({
      email: signUpDto.email,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      password: hashedPassword,
    });

    // remove password field from doctor object
    delete newUser.password;

    // sign jwt token and return it with newUser
    const jwt = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
    });
    return { newUser, jwt };
  }

  async signIn(signInDto: SignInDto) {
    // check email is already registered
    const existedUser = await this.doctorRepository.findOne({
      email: signInDto.email,
    });
    if (!existedUser) {
      throw new BadRequestException(['Hatalı email veya şifre']);
    }

    // compare passwords
    if (!(await bcrypt.compare(signInDto.password, existedUser.password))) {
      throw new BadRequestException(['Hatalı email veya şifre']);
    }

    // return signed jwt token
    return await this.jwtService.signAsync({
      id: existedUser.id,
      email: existedUser.email,
    });
  }

  async getUser(token: string) {
    // verify token and get token datas
    const data = await this.jwtService.verifyAsync(token);
    // find doctor user
    const user = await this.doctorRepository.findOne({ id: data.id });
    // and return
    return user;
  }

  async changePassword(token: string, changePasswordDto: ChangePasswordDto) {
    const data = await this.jwtService.verifyAsync(token);
    const user = await this.doctorRepository.findOne({ id: data.id });
    if (!user) {
      throw new NotFoundException(['Kullanıcı bulunamadı']);
    }

    if (!(await bcrypt.compare(changePasswordDto.oldPassword, user.password))) {
      throw new BadRequestException(['Girilen eski şifre hatalı']);
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
    user.password = hashedPassword;

    return this.doctorRepository.save(user);
  }
}
