import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType("LinkObjectType")
@InputType("LinkInputType")
export class Link {
    @Field(() => String)
    url: string;
}
