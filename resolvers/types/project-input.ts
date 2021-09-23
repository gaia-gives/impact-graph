import { MaxLength } from "class-validator";
import { InputType, Field } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { Category } from "../../entities/category";

@InputType()
export class ImageUpload {
  // Client uploads image file
  @Field((type) => GraphQLUpload, { nullable: true })
  image?: FileUpload;

  @Field({ nullable: true })
  projectId?: number;
}

@InputType()
export class ProjectInput {
  @Field()
  @MaxLength(70)
  title: string;

  @Field({ nullable: true })
  admin?: string;

  @Field({ nullable: true })
  // @Length(0, 2000)
  description?: string;
  // Removing this as rich texts are longer
  // We can consider making this check without img or video tags

  @Field(() => [Category], { nullable: true, defaultValue: [] })
  categories?: Category[];

  // Client uploads image file
  @Field(() => GraphQLUpload, { nullable: true })
  imageUpload?: FileUpload;

  // One of static image of website is used as the picture
  @Field({ nullable: true })
  imageStatic?: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  impactLocations?: string[];

  @Field({ nullable: true })
  organisationId?: number;

  @Field({ nullable: true })
  coOrdinates?: string;

  @Field({ nullable: true })
  walletAddress?: string;
}
