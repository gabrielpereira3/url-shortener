import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import {User} from '../../users/entities/user.entity';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  urlId: string;

  @Column()
  longUrl: string;

  @Column({unique: true})
  token: string;

  @Column({nullable: true})
  clicks: number;

  @ManyToOne(() => User, (user) => user.urls, {nullable: true})
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({nullable: true})
  updatedAt: Date;

  @DeleteDateColumn({nullable: true})
  deletedAt: Date;
}
