import { Field, InputType, ObjectType } from "type-graphql";
import { File } from ".";

@ObjectType("OrganisationalStructureObjectType")
@InputType("OrganisationalStructureInputType")
export class OrganisationalStructure {
  @Field({ nullable: true })
  public text?: string;

  @Field(() => [File!], { nullable: true })
  public files?: File[];
}

@InputType()
export class SubmitOrganisationalStructure {
  @Field()
  public text: string;

  @Field(() => [File!])
  public files: File[];
}