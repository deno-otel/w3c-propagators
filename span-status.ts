export enum StatusCode {
  UNSET = 0,
  OK = 1,
  ERROR = 2,
}

export type SpanStatus = {
  code: StatusCode;
  description?: string;
};
