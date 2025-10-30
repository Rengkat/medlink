import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return 'CREATE patient endpoint not implemented yet';
    // this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return 'GET all patients endpoint not implemented yet';
    // this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'GET patient by ID endpoint not implemented yet';
    // this.patientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return 'UPDATE patient endpoint not implemented yet';
    // this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'DELETE patient endpoint not implemented yet';
    //this.patientsService.remove(+id);
  }
}
