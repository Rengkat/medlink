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
  @MinLength(2, { message: 'First name is too short' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Last name is too short' })
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
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
