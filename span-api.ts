import { Attribute } from "./deps.ts";
import { AttributeCollection } from "./deps.ts";
import { SpanContext } from "./span-context.ts";
import { SpanEvent } from "./span-event.ts";
import { SpanKind } from "./span-kind.ts";
import { SpanLink } from "./span-link.ts";
import { SpanStatus } from "./span-status.ts";
import { Timestamp } from "./types.ts";

export class SpanAttributes extends AttributeCollection {}

export interface SpanAPI {
  readonly name: string;
  readonly spanContext: SpanContext;
  readonly parent: SpanAPI | SpanContext | null;
  readonly spanKind: SpanKind;
  readonly start: Timestamp;
  readonly end: Timestamp | null;
  readonly attributes: SpanAttributes;
  readonly links: SpanLink[];
  readonly events: SpanEvent[];
  readonly status: SpanStatus;
  readonly isRecording: boolean;

  getSpanContext(): SpanContext;
  setAttribute(key: string, value: unknown): void;
  setAttributes(attributes: Attribute[]): void;
  addLink(spanContext: SpanContext, attributes?: SpanLink["attributes"]): void;
  addEvent(
    name: string,
    time: Timestamp,
    attributes?: SpanEvent["attributes"]
  ): void;
  recordException(exception: Error, attributes?: SpanEvent["attributes"]): void;
  setStatus(
    code: SpanStatus["code"],
    message?: SpanStatus["description"]
  ): void;
  updateName(name: string): void;
  endSpan(endTime?: Timestamp): void;
}
