import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class FilterUsersDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'John' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ example: 'Doe' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @ApiProperty({ example: 10 })
    @IsOptional()
    @IsNumber()
    limit?: number = 10;


}