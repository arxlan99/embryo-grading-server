import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email geçerli bir email adresi olmalı' })
  @ApiProperty()
  email: string;

  @MinLength(6, { message: 'Şifre en az 6 karakter uzunluğunda olmalı' })
  @ApiProperty()
  password: string;
}
