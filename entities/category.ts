import { Field, ID, ObjectType } from "type-graphql";
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  ManyToMany,
} from "typeorm";
import { Application } from "./application";
import { Project } from "./project";

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { unique: true, nullable: true })
  name: string;

  @Field()
  @Column({ nullable: true })
  value: string;

  @Field()
  @Column({ nullable: true })
  source: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string;

  @Field({ nullable: true})
  @Column({ nullable: true })
  headline: string;

  @Field({ nullable: true})
  @Column({ nullable: true })
  description: string;

  @ManyToMany((type) => Project, (project) => project.categories)
  projects: Project[];

  @ManyToMany((type) => Application, (application) => application.categories)
  applications: Application[];
}
