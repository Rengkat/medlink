// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { ConflictException } from 'src/common/exceptions/conflict.exception';
import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { UserResponse, UserWithoutPassword } from './types/user-respnse.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Helper method to remove password and handle computed properties
  private toUserResponse(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Helper method to create user with computed properties
  private toUserResponseWithComputed(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;

    // Add computed properties as regular properties
    return {
      ...userWithoutPassword,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      isVerificationTokenValid:
        user.verificationToken && user.verificationTokenExpiry
          ? new Date() < user.verificationTokenExpiry
          : false,
    };
  }

  // Sign up
  public async create(
    createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    try {
      // Find if user with email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists', {
          email: createUserDto.email,
        });
      }

      // Hash the password before saving
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      // Create and save the new user
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(newUser);

      return this.toUserResponse(savedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user', {
        originalError: error.message,
      });
    }
  }

  // For login - validate user credentials
  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  // This method is specifically for login to fetch user with password
  async findForLogin(email: string): Promise<User | null> {
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
        'isVerified',
      ],
    });
  }

  // For login - fetch user by email without password
  async findOneByEmail(email: string): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    return this.toUserResponse(user);
  }

  // For other operations - fetch user by ID without password
  async findOneById(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this ID does not exist');
    }
    return this.toUserResponse(user);
  }

  // Get user with computed properties
  async findOneByIdWithComputed(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this ID does not exist');
    }
    return this.toUserResponseWithComputed(user);
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toUserResponse(user));
  }

  // Update user by ID
  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User with this ID does not exist');
      }

      if (updateUserDto.password) {
        const saltRounds = 12;
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,

          saltRounds,
        );
      }

      const updatedUser = this.userRepository.merge(user, updateUserDto);
      const savedUser = await this.userRepository.save(updatedUser);
      return this.toUserResponse(savedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user', {
        originalError: error.message,
      });
    }
  }

  // to update user by email
  async updateUserByEmail(
    email: string,
    updates: Partial<User>,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User with this email does not exist');
      }

      if (updates.password) {
        const saltRounds = 12;
        updates.password = await bcrypt.hash(updates.password, saltRounds);
      }

      const updatedUser = this.userRepository.merge(user, updates);
      const savedUser = await this.userRepository.save(updatedUser);
      return this.toUserResponse(savedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user', {
        originalError: error.message,
      });
    }
  }

  // Delete user by ID
  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User #${id} has been deleted` };
  }
}
