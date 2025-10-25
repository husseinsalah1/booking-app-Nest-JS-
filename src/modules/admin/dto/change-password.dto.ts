import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ example: 'newPassword123', minLength: 6 })
    @IsString()
    @MinLength(6)
    newPassword: string;
}
