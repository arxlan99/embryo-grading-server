import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';

@Entity()
export class Record {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column()
    url: string;

    @ManyToOne(type => Patient, patient => patient.records)
    patient: Patient;

    @CreateDateColumn()
    createdAt: Date;
}