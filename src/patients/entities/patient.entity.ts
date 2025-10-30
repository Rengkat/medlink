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

  @Column({ type: 'jsonb', nullable: true })
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };

  @Column({ type: 'varchar', nullable: true })
  activationSecretHash: string;

  @Column({ default: false })
  isOnlineAccessActive: boolean;

  // @OneToMany(() => MedicalRecord, (record) => record.patient)
  // medicalRecords: MedicalRecord[];

  // @OneToMany(() => Appointment, (appointment) => appointment.patient)
  // appointments: Appointment[];

  @Column({ type: 'jsonb', default: {} })
  allergies: string[];

  @Column({ type: 'jsonb', default: {} })
  currentMedications: string[];

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
