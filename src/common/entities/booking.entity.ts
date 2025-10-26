import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

export enum BookingStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    classId: number;

    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.ACTIVE })
    status: BookingStatus;

    @Column({ default: 0 })
    creditsUsed: number;

    @Column({ nullable: true })
    cancelledAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.bookings)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Class, classEntity => classEntity.bookings)
    @JoinColumn({ name: 'classId' })
    class: Class;
}
