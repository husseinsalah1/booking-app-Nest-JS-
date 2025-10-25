import { Controller, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateCreditsDto } from '../../common/dto/booking.dto';
import { User } from '../../common/entities/user.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { FilterUsersDto } from './dto/filter.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

const adminsOnly = ['admin', 'super_admin'];

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get('')
  @ApiOperation({ summary: 'Get all users' })
  @Roles(...adminsOnly)
  @ApiResponse({ status: 200, description: 'All users retrieved successfully', type: [User] })
  async getAllUsers(@Query() filterUsersDto: FilterUsersDto): Promise<ResponseDto<User[]>> {
    const { data, pagination }: { data: User[], pagination: PaginationDto } = await this.userService.find(filterUsersDto);
    return {
      data: data,
      pagination: pagination,
      message: 'Users retrieved successfully',
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: User })
  async getProfile(@Request() req): Promise<User> {
    return this.userService.findById(req.user.id);
  }

  @Put('credits')
  @ApiOperation({ summary: 'Update user credits (admin only)' })
  @ApiResponse({ status: 200, description: 'Credits updated successfully', type: User })
  async updateCredits(@Request() req, @Body() updateCreditsDto: UpdateCreditsDto): Promise<User> {

    return this.userService.updateCredits(req.user.id, updateCreditsDto.credits);
  }
  @Put('credits/add')
  @ApiOperation({ summary: 'Add credits to user' })
  @ApiResponse({ status: 200, description: 'Credits added successfully', type: User })
  async addCredits(@Request() req, @Body() updateCreditsDto: any): Promise<User> {
    return this.userService.addCredits(req.user.id, updateCreditsDto.credits);
  }


}
