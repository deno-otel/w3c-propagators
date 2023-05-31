import { AttributeCollection } from "./deps.ts";
import { SpanContext } from "./span-context.ts";

export class LinkAttributes extends AttributeCollection {}

export type SpanLink = {
  spanContext: SpanContext;
  attributes: LinkAttributes;
};
