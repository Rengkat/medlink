import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PharmacistsService } from './pharmacists.service';
import { CreatePharmacistDto } from './dto/create-pharmacist.dto';
import { UpdatePharmacistDto } from './dto/update-pharmacist.dto';

@Controller('pharmacists')
export class PharmacistsController {
  constructor(private readonly pharmacistsService: PharmacistsService) {}

  @Post()
  create(@Body() createPharmacistDto: CreatePharmacistDto) {
    return this.pharmacistsService.create(createPharmacistDto);
  }

  @Get()
  findAll() {
    return this.pharmacistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePharmacistDto: UpdatePharmacistDto) {
    return this.pharmacistsService.update(+id, updatePharmacistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacistsService.remove(+id);
  }
}
