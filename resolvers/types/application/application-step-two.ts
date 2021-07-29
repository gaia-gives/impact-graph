import { FileReference } from './../../../entities/fileReference';
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class OrganisationalStructure {
    @Field({ nullable: true })
    public text?: string;

    @Field(() => [FileReference!], { nullable: true })
    public savedFiles?: FileReference[];
}

@ObjectType()
class ValidationMaterial {
    @Field(() => [String!], { nullable: true })
    public links?: string[];

    @Field(() => [FileReference!], { nullable: true })
    public savedFiles?: FileReference[];
}

@ObjectType()
export class ApplicationStepTwoDraft {
    @Field(() => ID!, { nullable: false })
    public id: string;

    @Field(() => ValidationMaterial, { nullable: true })
    public validationMaterial?: ValidationMaterial;

    @Field(() => OrganisationalStructure, { nullable: true })
    public organisationalStructure?: OrganisationalStructure;

    @Field(() => FileReference, { nullable: true })
    public charter?: FileReference;
    
    @Field(() => FileReference, { nullable: true})
    public document501c3?: FileReference;
}