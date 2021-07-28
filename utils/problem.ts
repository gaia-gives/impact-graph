export type ProblemCode = "MISSING_INFORMATION" | "MALFORMED_INPUT" | "UNKNOWN_ID";

export interface Problem {
    code: ProblemCode;
    message: string;
}