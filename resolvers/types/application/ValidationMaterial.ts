import { Field, InputType, ObjectType } from "type-graphql";
import { File, Link } from ".";

@ObjectType("ValidationMaterialObjectType")
@InputType("ValidationMaterialInputType")
export class ValidationMaterial {
  @Field(() => [Link!], { nullable: true })
  public links?: Link[];

  @Field(() => [File!], { nullable: true })
  public files?: File[];
}


@InputType()
export class SubmitValidationMaterial {
  @Field(() => [Link!])
  public links: Link[];

  @Field(() => [File!])
  public files: File[];
}
