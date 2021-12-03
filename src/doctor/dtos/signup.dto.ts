import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty({
        message: "Ad alanı boş olmamalı"
    })
    @ApiProperty()
    firstName: string;

    @IsNotEmpty({
        message: "Soyad alanı boş olmamalı"
    })
    @ApiProperty()
    lastName: string;

    @IsEmail({}, {message: "Email geçerli bir email adresi olmalı"})
    @ApiProperty()
    email: string;

    @MinLength(6, {message: "Şifre en az 6 karakter uzunluğunda olmalı"})
    @ApiProperty()
    password: string;
}
