import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create.dto';
import { UpdateAdminDto } from './dto/update.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FilterAdminsDto } from './dto/filter-admins.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseDto } from '../../common/dto/response.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('super_admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create admin' })
    @ApiResponse({ status: 201, description: 'Admin created successfully', type: AdminResponseDto })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<ResponseDto<AdminResponseDto>> {
        const data = await this.adminService.create(createAdminDto);
        return {
            data: data,
            message: 'Admin created successfully',
        };
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles('admin', 'super_admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all admins' })
    @ApiResponse({ status: 200, description: 'Admins retrieved successfully', type: [AdminResponseDto] })
    async getAllAdmins(@Query() filterAdminsDto: FilterAdminsDto = new FilterAdminsDto()): Promise<ResponseDto<AdminResponseDto[]>> {
        const { data, pagination } = await this.adminService.getAllAdmins(filterAdminsDto);
        return {
            data: data,
            pagination: pagination,
            message: 'Admins retrieved successfully',
        };
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get admin by ID' })
    @ApiResponse({ status: 200, description: 'Admin retrieved successfully', type: AdminResponseDto })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    async getAdminById(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<AdminResponseDto>> {
        const data = await this.adminService.getAdminById(id);
        return {
            data: data,
            message: 'Admin retrieved successfully',
        };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update admin' })
    @ApiResponse({ status: 200, description: 'Admin updated successfully', type: AdminResponseDto })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    async updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAdminDto: UpdateAdminDto,
    ): Promise<ResponseDto<AdminResponseDto>> {
        const data = await this.adminService.updateAdmin(id, updateAdminDto);
        return {
            data: data,
            message: 'Admin updated successfully',
        };
    }

    @Put(':id/change-password')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change admin password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 401, description: 'Current password is incorrect' })
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Param('id', ParseIntPipe) id: number): Promise<ResponseDto<string>> {
        await this.adminService.changePassword(id, changePasswordDto);
        return {
            message: 'Password changed successfully',
        };
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete admin' })
    @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    async deleteAdmin(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<string>> {
        await this.adminService.deleteAdmin(id);

        return {
            message: `Admin with id: ${id} deleted successfully`,
        };

    }
}
