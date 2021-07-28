import { ProblemType } from './ProblemType';
import { Problem } from './../../utils/problem';
import { Field, ObjectType } from "type-graphql";

export interface ResolverResultProps {
  success: boolean;
  problems: Problem[];

  addProblem(problem: Problem);
  setUnsuccessful(...problems: Problem[]);
}

@ObjectType()
export abstract class ResolverResult implements ResolverResultProps {
    @Field(() => Boolean)
    public success = true;
    @Field(() => [ProblemType]!)
    public problems = new Array<Problem>();

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    setUnsuccessful(...problems: Problem[]) {
        this.success = false;
        for (const prob of problems) {
            this.addProblem(prob);
        }
    }
}
