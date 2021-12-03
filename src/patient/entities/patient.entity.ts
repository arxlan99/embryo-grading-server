import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

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

    @Column()
    phoneNumber: string;

    @CreateDateColumn()
    createdAt: Date;
}