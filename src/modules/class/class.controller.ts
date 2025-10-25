import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClassService } from './class.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Class } from '../../common/entities/class.entity';
import { CreateClassDto, UpdateClassDto, ClassResponseDto } from './dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { FilterClassesDto } from './dto/filter-dto';

const adminsOnly = ['admin', 'super_admin'];

@ApiTags('Classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(...adminsOnly)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new class (Admin only)' })
  @ApiResponse({ status: 201, description: 'Class successfully created', type: Class })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async create(@Body() createClassDto: CreateClassDto): Promise<ResponseDto<ClassResponseDto>> {
    const data = await this.classService.create(createClassDto);
    return {
      data: data,
      message: 'Class created successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully', type: [Class] })
  async findAll(@Query() filterClassesDto: FilterClassesDto): Promise<ResponseDto<ClassResponseDto[]>> {
    const { data, pagination } = await this.classService.findAll(filterClassesDto);
    return {
      data: data,
      pagination: pagination,
      message: 'Classes retrieved successfully',
    };
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming classes' })
  @ApiResponse({ status: 200, description: 'Upcoming classes retrieved successfully', type: [Class] })
  async findUpcoming(): Promise<ResponseDto<ClassResponseDto[]>> {
    const data = await this.classService.findUpcoming();
    return {
      data: data,
      message: 'Upcoming classes retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, description: 'Class retrieved successfully', type: Class })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<ClassResponseDto>> {
    const data = await this.classService.findById(id);
    return {
      data: data,
      message: 'Class retrieved successfully',
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(...adminsOnly)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update class (Admin only)' })
  @ApiResponse({ status: 200, description: 'Class successfully updated', type: Class })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto): Promise<ResponseDto<ClassResponseDto>> {
    const data = await this.classService.update(id, updateClassDto);
    return {
      data: data,
      message: 'Class updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(...adminsOnly)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete class (Admin only)' })
  @ApiResponse({ status: 200, description: 'Class successfully deleted' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async remove(@Param('id') id: string): Promise<ResponseDto<void>> {
    await this.classService.delete(id);
    return {
      data: null,
      message: 'Class deleted successfully',
    };
  }
}
