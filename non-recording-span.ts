import { SpanContext } from "./span-context.ts";
import { SpanEvent } from "./span-event.ts";
import { SpanKind } from "./span-kind.ts";
import { SpanLink } from "./span-link.ts";
import { SpanStatus, StatusCode } from "./span-status.ts";
import { SpanAPI, SpanAttributes } from "./span-api.ts";

export class NonRecordingSpan implements SpanAPI {
  readonly name: string;
  readonly spanContext: SpanContext;
  readonly parent: SpanAPI | SpanContext | null;
  readonly spanKind: SpanKind.INTERNAL;
  readonly start: number;
  readonly end: number | null;
  readonly attributes: SpanAttributes;
  readonly links: SpanLink[];
  readonly events: SpanEvent[];
  readonly status: SpanStatus;
  readonly isRecording: boolean;

  private constructor(spanContext: SpanContext) {
    this.name = "";
    this.spanContext = spanContext;
    this.parent = null;
    this.spanKind = SpanKind.INTERNAL;
    this.start = 0;
    this.end = null;
    this.attributes = new SpanAttributes();
    this.links = [];
    this.events = [];
    this.status = { code: StatusCode.UNSET };
    this.isRecording = false;
  }

  static fromSpanContext(spanContext: SpanContext): NonRecordingSpan {
    return new NonRecordingSpan(spanContext);
  }

  getSpanContext(): SpanContext {
    return this.spanContext;
  }
  setAttribute(): void {}
  setAttributes(): void {}
  addLink(): void {}
  addEvent(): void {}
  recordException(): void {}
  setStatus(): void {}
  updateName(): void {}
  endSpan(): void {}
}
