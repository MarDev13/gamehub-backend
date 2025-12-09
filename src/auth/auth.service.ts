import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { RoleName } from "@prisma/client";

@Injectable()

export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

    async register(dto: RegisterDto) {
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (existingEmail) {
            throw new BadRequestException('El email ya está registrado');
        }
        const  existingUserName = await this.prisma.user.findUnique({
            where: { userName: dto.userName}
        })
        if(existingUserName) {
            throw new BadRequestException('El nombre de usuario ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                userName: dto.userName,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: {
                    connect: { name: 'USER' }
                },
            },
        });
        return {
            message: 'Usuario registrado correctamente',
            user: {
                email: newUser.email,
                userName: newUser.userName,
            },
        };
    }
    async login(dto: LoginDto){
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { role: true }, 
        });
        if (!user){
            throw new BadRequestException('Credenciales incorrectas');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid){
            throw new BadRequestException('Credenciales incorrectas');
        }
        const payload = { sub: user.id, email: user.email, username: user.userName,  role: user.role.name };
        const token = await this.jwtService.signAsync(payload);
        return {
            message: 'Inicio de sesión exitoso',
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                userName: user.userName,
                role: user.role.name,
            },
        };
    }
}