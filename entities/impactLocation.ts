import { Field, ObjectType, ID } from 'type-graphql';
import { ManyToMany, BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Project } from './project';

@Entity()
@ObjectType()
export class ImpactLocation extends BaseEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field({ nullable: false })
    @Column({ nullable: false })
    name: string;

    @Field(type => [ImpactLocation], { nullable: true })
    @ManyToMany(
        type => Project,
        project => project.impactLocations,
        { eager: false }
    )
    projects: Project[];
}