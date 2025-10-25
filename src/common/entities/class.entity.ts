import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('classes')
export class Class {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    instructor: string;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @Column({ default: 0 })
    capacity: number;

    @Column({ default: 0 })
    currentBookings: number;

    @Column({ default: 1 })
    creditsRequired: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Booking, booking => booking.class)
    bookings: Booking[];

    get isFull(): boolean {
        return this.currentBookings >= this.capacity;
    }

    get availableSpots(): number {
        return this.capacity - this.currentBookings;
    }
}
