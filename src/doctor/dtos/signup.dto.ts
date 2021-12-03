import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @MinLength(6)
    @ApiProperty()
    password: string;
}
