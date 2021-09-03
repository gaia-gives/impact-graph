import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType("FileObjectType")
@InputType("FileInputType")
export class File {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;
    @Field(() => String)
    type: string;
    @Field(() => Number)
    size: number;
}
