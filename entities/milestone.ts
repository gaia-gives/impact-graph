import { Field, ObjectType, ID, Float, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./project";

export enum MilestoneStatus {
  "notReached" = 0,
  "active" = 1,
  "reached" = 2,
}
registerEnumType(MilestoneStatus, {
  name: "MilestoneStatus",
  description: "Determines the status of the milestone",
});

@Entity()
@ObjectType()
export class Milestone extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => Float)
  @Column("real", { nullable: false, default: 0 })
  threshold: number;

  @Field((type) => MilestoneStatus, { nullable: false })
  @Column({ nullable: false, default: MilestoneStatus.notReached })
  status: MilestoneStatus;

  setActive(): void {
    if (this.status > MilestoneStatus.active) {
      throw new Error("Cannot set already reached milestone back to active!");
    } else {
      this.status = MilestoneStatus.active;
    }
  }

  checkAndSetIfReached(currentAmountRaised: number): boolean {
    if (this.status === MilestoneStatus.reached) return true;
    let reached = false;
    if (currentAmountRaised >= this.threshold) {
      this.status = MilestoneStatus.reached;
      reached = true;
    }
    return reached;
  }

  @Field()
  @Column("text", { nullable: true })
  title?: string;

  @Field()
  @Column("text", { nullable: true })
  description?: string;

  @Field()
  @Column("text", { nullable: true })
  mediaLink?: string;

  @Field((type) => Project, { nullable: false })
  @ManyToOne((type) => Project)
  project: Project;

  @Field((type) => ID, { nullable: false })
  @Column({ nullable: false })
  projectId: number;
}
