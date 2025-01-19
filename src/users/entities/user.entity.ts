import {Url} from 'src/urls/entities/url.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({default: true})
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({nullable: true})
  updatedAt: Date;

  @OneToMany(() => Url, (url) => url.user, {cascade: true})
  urls: Url[];
}
