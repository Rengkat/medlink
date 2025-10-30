import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly userService: UserService,
  ) {}
  createPatientByAdmin(createPatientDto: CreatePatientDto) {
    return 'This action adds a new patient';
  }

  async findAllPatients() {
    try {
      return await this.patientRepository.find();
    } catch (error) {
      throw new BadRequestException('Could not fetch patients');
    }
  }

  async getPatientProfile(patientId: number) {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['user', 'medicalRecords', 'appointments'],
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  // updatePatient(id: number, updatePatientDto: UpdatePatientDto) {
  //   return `This action updates a #${id} patient`;
  // }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
