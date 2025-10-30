import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  IsDateString,
  IsPhoneNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

import { UserRole } from 'src/common/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be a valid value' })
  role: UserRole;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
