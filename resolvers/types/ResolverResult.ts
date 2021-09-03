import { ProblemType } from './ProblemType';
import { Problem } from './../../utils/problem';
import { Field, ObjectType } from "type-graphql";

export interface ResolverResultProps {
  success: boolean;
  problems: Problem[];

  addProblem(problem: Problem): void;
}

@ObjectType()
export abstract class ResolverResult implements ResolverResultProps {
    @Field(() => Boolean)
    public get success() {
        return this.problems.length === 0;
    }
    @Field(() => [ProblemType]!)
    public problems = new Array<Problem>();

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }
}
