import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConflictException } from 'src/common/exceptions/conflict.exception';
import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 1. Check for existing user
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists', {
          email: createUserDto.email,
        });
      }

      // 2. Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      // 3. Create and save the new user
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // 4. Remove the passwordHash from the response for security
      const savedUser = await this.userRepository.save(newUser);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Re-throw our custom exceptions
      }
      throw new InternalServerErrorException('Failed to create user', {
        originalError: error.message,
      });
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    // remove sensitive data when returning all users
    return users.map(({ password, ...user }) => user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'phone'],
    });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User with this ID does not exist');
    }
    return user;
  }

  async findForLogin(email: string): Promise<User | null> {
    // This method MUST select the password field for validation
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'role',
        'isActive',
      ],
    });
  }

  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Important: If the password is being updated, it must be re-hashed.
    // This logic should be here or in a dedicated method.
    const user = await this.findOneById(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    // Often better to soft-delete by setting isActive = false
    await this.userRepository.remove(user);
    return { message: `User #${id} has been deleted` };
  }
}
