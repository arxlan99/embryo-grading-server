import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @MinLength(6)
    @ApiProperty()
    password: string;
}