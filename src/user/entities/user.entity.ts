import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { UserRole } from 'src/common/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  @Index() // Add index for better performance
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Column({ nullable: false, unique: true })
  @Index() // Add index for better performance
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, length: 255 }) 
  verificationToken: string | null;

  @Column({ type: 'timestamptz', nullable: true }) 
  verificationTokenExpiry: Date | null;

  @Column({ default: false })
  isVerified: boolean; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  isVerificationTokenValid(): boolean {
    if (!this.verificationToken || !this.verificationTokenExpiry) {
      return false;
    }
    return new Date() < this.verificationTokenExpiry;
  }
}
