import { IsNotEmpty, Length } from 'class-validator';
import { UserRole } from 'src/common/user-role.enum';
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  password: string;

  @Column({
    enum: UserRole,
    default: UserRole.PATIENT,
    nullable: false,
  })
  role: string;

  @Column({ nullable: true, type: 'varchar' })
  phone?: string;

  @CreateDateColumn()
  dateOfBirth?: Date;
}
