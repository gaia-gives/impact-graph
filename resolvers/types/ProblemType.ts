import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export abstract class ProblemType {
    @Field({ nullable: false })
    code: string;
    @Field({ nullable: false })
    message: string;
}