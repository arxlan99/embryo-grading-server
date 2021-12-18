import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class CreatePatientDto {
    @IsNotEmpty({ message: "Ad alanı boş olmamalı" })
    @ApiProperty()
    firstName: string;

    @IsNotEmpty({ message: "Soyad alanı boş olmamalı" })
    @ApiProperty()
    lastName: string;

    @Length(11, 11, { message: "TC No alanı 11 haneden oluşmalı" })
    @ApiProperty()
    tcNo: string;

    @IsDateString({},{ message: "Doğum tarihi alanı geçerli bir tarih olmalı" })
    @ApiProperty()
    birthDate: Date;

    @IsNumberString({}, { message: "Telefon No alanı geçerli bir numara olmalı" })
    @ApiProperty()
    phoneNumber: string;
}