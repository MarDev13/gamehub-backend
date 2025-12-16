import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RoleName } from "@prisma/client";
export class UpdateUserRoleDto {
    @ApiProperty()
    @IsEnum(RoleName)
    role: RoleName;
}