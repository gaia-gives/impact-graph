import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType("LinksObjectType")
@InputType("LinksInputType")
export class Links {
  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true })
  public facebook?: string;

  @Field({ nullable: true })
  public instagram?: string;

  @Field({ nullable: true })
  public other?: string;
}

@InputType()
export class SubmitLinks {
  @Field()
  public website: string;

  @Field({ nullable: true })
  public facebook?: string;

  @Field({ nullable: true })
  public instagram?: string;

  @Field({ nullable: true })
  public other?: string;
}
