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
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  //sign up
  public async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      //find if user with email already exists
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
      // Exclude password from the returned user object
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
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
      ],
    });
  }

  // For login - fetch user by email without password
  async findOneByEmail(email: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'phone',
        'verificationToken',
        'verificationTokenExpiry',
        'isVerify',
      ],
    });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    return user;
  }

  // For other operations - fetch user by ID without password
  async findOneById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'phone',
        'verificationToken',
        'verificationTokenExpiry',
        'isVerify',
        'isActive',
        'dateOfBirth',
      ],
    });
    if (!user) {
      throw new NotFoundException('User with this ID does not exist');
    }
    return user;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    // remove sensitive data when returning all users
    return users.map(({ password, ...user }) => user);
  }
  // Update user by ID
  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.findOneById(id);
      if (updateUserDto.password) {
        const saltRounds = 12;
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          saltRounds,
        );
      }
      const updatedUser = Object.assign(user, updateUserDto);
      const savedUser = await this.userRepository.save(updatedUser);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user', {
        originalError: error.message,
      });
    }
  }

  // New method to update user by email
  async updateUserByEmail(
    email: string,
    updates: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.findOneByEmail(email);
      if (updates.password) {
        const saltRounds = 12;
        updates.password = await bcrypt.hash(updates.password, saltRounds);
      }
      const updatedUser = Object.assign(user, updates);
      const savedUser = await this.userRepository.save(updatedUser);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
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
