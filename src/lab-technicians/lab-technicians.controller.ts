import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabTechniciansService } from './lab-technicians.service';
import { CreateLabTechnicianDto } from './dto/create-lab-technician.dto';
import { UpdateLabTechnicianDto } from './dto/update-lab-technician.dto';

@Controller('lab-technicians')
export class LabTechniciansController {
  constructor(private readonly labTechniciansService: LabTechniciansService) {}

  @Post()
  create(@Body() createLabTechnicianDto: CreateLabTechnicianDto) {
    return this.labTechniciansService.create(createLabTechnicianDto);
  }

  @Get()
  findAll() {
    return this.labTechniciansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTechniciansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabTechnicianDto: UpdateLabTechnicianDto) {
    return this.labTechniciansService.update(+id, updateLabTechnicianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTechniciansService.remove(+id);
  }
}
