import { User } from 'src/user/entities/user.entity';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BloodType } from 'src/common/blood-type.enum';

@Entity()
export class Patient extends User {
  @Column({ unique: true, nullable: false })
  medLinkId: string;

  @Column({ type: 'enum', enum: BloodType, nullable: true })
  bloodType: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'json', nullable: true })
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  @Column({ type: 'varchar', nullable: true })
  activationSecretHash: string;

  @Column({ default: false })
  isOnlineAccessActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashActivationSecret() {
    if (this.activationSecretHash) {
      const saltRounds = 10;
      this.activationSecretHash = await bcrypt.hash(
        this.activationSecretHash,
        saltRounds,
      );
    }
  }

  async validateActivationSecret(secret: string): Promise<boolean> {
    if (!this.activationSecretHash) return false;
    return await bcrypt.compare(secret, this.activationSecretHash);
  }
}
