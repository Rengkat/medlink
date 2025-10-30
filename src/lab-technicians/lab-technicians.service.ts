import { Injectable } from '@nestjs/common';
import { CreateLabTechnicianDto } from './dto/create-lab-technician.dto';
import { UpdateLabTechnicianDto } from './dto/update-lab-technician.dto';

@Injectable()
export class LabTechniciansService {
  create(createLabTechnicianDto: CreateLabTechnicianDto) {
    return 'This action adds a new labTechnician';
  }

  findAll() {
    return `This action returns all labTechnicians`;
  }

  findOne(id: number) {
    return `This action returns a #${id} labTechnician`;
  }

  update(id: number, updateLabTechnicianDto: UpdateLabTechnicianDto) {
    return `This action updates a #${id} labTechnician`;
  }

  remove(id: number) {
    return `This action removes a #${id} labTechnician`;
  }
}
