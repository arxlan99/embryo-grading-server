import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Record } from './record.entity';

@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    tcNo: string;

    @Column({ type: 'timestamptz' })
    birthDate: Date;

    @ManyToOne(type => Doctor, doctor => doctor.patients)
    doctor: Doctor;

    @OneToMany(type => Record, record => record.patient)
    records: Record[];

    @Column()
    phoneNumber: string;

    @CreateDateColumn()
    createdAt: Date;
}