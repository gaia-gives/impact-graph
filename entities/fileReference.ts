import { Application } from "./application";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class FileReference extends BaseEntity {
  @Field(() => ID, { nullable: false })
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  filename: string;

  @Field({ nullable: false })
  @Column({ nullable: false })
  path: string;

  @Field({nullable: false})
  @Column({ nullable: false })
  mimetype: string;

  @Column({ nullable: false })
  mapsToField: string;

  @Field(() => Application!, { nullable: false })
  @ManyToOne(() => Application, (application) => application.fileReferences)
  application: Application;
}
