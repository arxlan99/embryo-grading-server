import { MinLength  } from "class-validator";
import { Match } from "../decorators/match.decorator";

export class ChangePasswordDto {
    @MinLength(6, {message: "Eski şifre en az 6 karakter uzunluğunda olmalı"})
    oldPassword: string;

    @MinLength(6, {message: "Yeni şifre en az 6 karakter uzunluğunda olmalı"})
    newPassword: string;

    @MinLength(6, {message: "Şifre en az 6 karakter uzunluğunda olmalı"})
    @Match('newPassword')
    confirm: string;
}