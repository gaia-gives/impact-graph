import { Application } from './application';
import { Field, ObjectType, ID } from 'type-graphql';
import { ManyToMany, BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from './project';

@Entity()
@ObjectType()
export class ImpactLocation extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field({ nullable: true })
    @Column('text', { unique: true, nullable: true })
    name: string;

    @Field()
    @Column({ nullable: true })
    value: string

    @Field(type => [ImpactLocation], { nullable: true })
    @ManyToMany(
        type => Project,
        project => project.impactLocations,
        { eager: false }
    )
    projects: Project[];
}