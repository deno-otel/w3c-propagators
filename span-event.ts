import { AttributeCollection } from "./deps.ts";
import { Timestamp } from "./types.ts";

export class EventAttributes extends AttributeCollection {}

export type SpanEvent = {
  name: string;
  eventTime: Timestamp;
  attributes: EventAttributes;
};
