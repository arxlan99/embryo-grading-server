import { Exclude } from 'class-transformer';
import { Patient } from 'src/patient/entities/patient.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(type => Patient, patient => patient.doctor)
    patients: Patient[];

    @Column()    
    @Exclude()
    password: string;

    @Column({ default: true })
    isActive: boolean;
}