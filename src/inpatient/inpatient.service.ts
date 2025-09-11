import { Injectable } from '@nestjs/common';
import { CreateInpatientDto } from './dto/create-inpatient.dto';
import { UpdateInpatientDto } from './dto/update-inpatient.dto';

@Injectable()
export class InpatientService {
  create(createInpatientDto: CreateInpatientDto) {
    return 'This action adds a new inpatient';
  }

  findAll() {
    return `This action returns all inpatient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inpatient`;
  }

  update(id: number, updateInpatientDto: UpdateInpatientDto) {
    return `This action updates a #${id} inpatient`;
  }

  remove(id: number) {
    return `This action removes a #${id} inpatient`;
  }
}
