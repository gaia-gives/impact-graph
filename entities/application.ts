import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";

@ObjectType()
@Entity()
export class Application extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field()
  @Column()
  public legalName!: string;

  @Field()
  @Column()
  public dba: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public address: string;

  @Field()
  @Column()
  public email: string;

  @Field()
  @Column()
  public missionStatement!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public website: string;

  @Field(() => [String])
  @Column("varchar", { array: true, nullable: true })
  public socialMediaUrls: string[];

  @Field(() => [Category])
  @JoinTable()
  @ManyToMany(() => Category, (category) => category.applications)
  public categories: Category[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.applications)
  public user: User;
}
