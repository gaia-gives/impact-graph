import { Field, InputType, ObjectType } from "type-graphql"

@ObjectType("GeneralObjectType")
@InputType("GeneralInputType")
export class General {
    @Field({nullable: true})
    address?: string;
    @Field({nullable: true})
    city?: string;
    @Field({nullable: true})
    postcode?: string;
    @Field({nullable: true})
    country?: string;
    @Field({nullable: true})
    contactPerson?: string
    @Field({nullable: true})
    email?: string;
}

@InputType()
export class SubmitGeneral {
    @Field()
    address: string;
    @Field()
    city: string;
    @Field()
    postcode: string;
    @Field()
    country: string;
    @Field()
    contactPerson: string
    @Field()
    email: string;
}