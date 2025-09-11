import { PartialType } from '@nestjs/mapped-types';
import { CreateInpatientDto } from './create-inpatient.dto';

export class UpdateInpatientDto extends PartialType(CreateInpatientDto) {}
