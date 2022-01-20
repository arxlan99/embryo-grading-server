import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { SignUpDto } from './dtos/signup.dto';
import { Response, Request } from 'express';
import { SignInDto } from './dtos/signin.dto';
import { AuthGuard } from './guards/auth.guard';
import { ChangePasswordDto } from './dtos/changePassword.dto';

@ApiTags('doctors')
@Controller('doctors')
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)
  getAll() {
    return this.doctorService.getAll();
  }

  @Get('stats')
  @HttpCode(200)
  getStats() {
    return this.doctorService.getStats();
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.doctorService.signIn(signInDto);
    res.cookie('jwt', jwt, { httpOnly: true, sameSite: 'none', secure: true });

    return {
      msg: 'Signin success',
    };
  }

  @Post('signup')
  @HttpCode(201)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { newUser, jwt } = await this.doctorService.signUp(signUpDto);
    res.cookie('jwt', jwt, { httpOnly: true, sameSite: 'none', secure: true });

    return newUser;
  }

  @Post('signout')
  @HttpCode(200)
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');

    return {
      msg: 'Signout success',
    };
  }

  @Post('change-password')
  @HttpCode(200)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const token = req.cookies.jwt;

    return this.doctorService.changePassword(token, changePasswordDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  currentUser(@Req() req: Request) {
    const token = req.cookies.jwt;

    return this.doctorService.getUser(token);
  }
}
