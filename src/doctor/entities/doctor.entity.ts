import { Exclude } from 'class-transformer';
import { Patient } from '../../patient/entities/patient.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Doctor {
    constructor(id: number,firstName: string, lastName: string, email: string, password: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

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