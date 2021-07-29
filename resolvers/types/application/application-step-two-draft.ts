import { FileReference } from './../../../entities/fileReference';
import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class OrganisationalStructure {
    @Field({ nullable: true })
    public text?: string;

    @Field(() => [FileReference!], { nullable: true })
    public savedFiles?: FileReference[];
}

@ObjectType()
export class ValidationMaterial {
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

@ArgsType()
export class ApplicationStepTwoDraftVariables {
    @Field(() => ID!, { nullable: false })
    public id: string;

    @Field(() => [String!], { nullable: true })
    public validationMaterial?: string[];

    @Field(() => String, { nullable: true })
    public organisationalStructure?: string;
}