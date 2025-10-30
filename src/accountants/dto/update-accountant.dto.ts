import { PartialType } from '@nestjs/swagger';
import { CreateAccountantDto } from './create-accountant.dto';

export class UpdateAccountantDto extends PartialType(CreateAccountantDto) {}
