import { Span } from "./span.ts";
import { getSpan } from "./context.ts";
import { AttributeCollection, ContextAPI } from "./deps.ts";
import { SpanKind } from "./span-kind.ts";
import { SpanLink } from "./span-link.ts";
import { SpanAPI, SpanAttributes } from "./span-api.ts";
import { Timestamp } from "./types.ts";

interface SpanCreationParams {
  kind?: SpanKind;
  attributes?: SpanAttributes;
  links?: SpanLink[];
  startTime?: Timestamp;
}

export interface TracerOptions {
  version?: string;
  schema_url?: string;
  attributes?: AttributeCollection;
}

export class Tracer {
  constructor(public readonly name: string, private options: TracerOptions) {}

  createSpan(
    spanName: string,
    parentContext: ContextAPI | null,
    params: SpanCreationParams = {}
  ): SpanAPI {
    const {
      kind = SpanKind.INTERNAL,
      attributes = new SpanAttributes(),
      links = [],
      startTime = Date.now(),
    } = params;

    const parentSpan: SpanAPI | null =
      parentContext === null ? null : getSpan(parentContext);

    const newSpan = new Span(spanName, parentContext, {
      kind,
      attributes,
      links,
      startTime,
    });

    return newSpan;
  }
}
