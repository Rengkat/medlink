import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InpatientService } from './inpatient.service';
import { CreateInpatientDto } from './dto/create-inpatient.dto';
import { UpdateInpatientDto } from './dto/update-inpatient.dto';

@Controller('inpatient')
export class InpatientController {
  constructor(private readonly inpatientService: InpatientService) {}

  @Post()
  create(@Body() createInpatientDto: CreateInpatientDto) {
    return this.inpatientService.create(createInpatientDto);
  }

  @Get()
  findAll() {
    return this.inpatientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inpatientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInpatientDto: UpdateInpatientDto) {
    return this.inpatientService.update(+id, updateInpatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inpatientService.remove(+id);
  }
}
