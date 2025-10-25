import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseDto } from '../common/dto/response.dto';
import { AuthResponseDto, LoginDto, RegisterDto } from 'src/common/dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login user or admin' })
  @ApiResponse({ status: 200, description: 'Successfully logged in', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<ResponseDto<AuthResponseDto>> {
    const data = await this.authService.login(loginDto);
    return {
      data: data,
      message: 'Logged in successfully',
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user or admin' })
  @ApiResponse({ status: 201, description: 'Successfully registered', type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto): Promise<ResponseDto<AuthResponseDto>> {
    const data = await this.authService.register(registerDto);
    return {
      data: data,
      message: 'User registered successfully',
    };
  }
}
