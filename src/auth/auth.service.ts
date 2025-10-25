import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../modules/user/user.service';
import { AdminService } from '../modules/admin/admin.service';
import { AuthFactory } from './factories/auth-factory';
import { AuthResponseDto, LoginDto, RegisterDto } from '../common/dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly authFactory: AuthFactory,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      credits: 0,
      role: 'guest',
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      type: 'user',
      email: user.email,
      role: user.role || 'guest'
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    const authResult = await this.authFactory.createAuthResult(email, password);
    if (!authResult) {
      throw new UnauthorizedException('Credentials are incorrect');
    }
    const jwtPayload = await this.authFactory.createJwtPayload(authResult.entity, authResult.type);
    const accessToken = this.jwtService.sign(jwtPayload);
    const response = this.authFactory.formatAuthResponse(authResult.entity, authResult.type);
    let data = {
      ...response,
      accessToken,
    }
    return data
  }

  async validateUser(email: string, password: string): Promise<any> {
    const authResult = await this.authFactory.createAuthResult(email, password);
    return authResult;
  }

  async validate(payload: any) {
    if (payload.type === 'admin') return this.adminService.findById(payload.sub);
    return this.userService.findById(payload.sub);
  }
}
