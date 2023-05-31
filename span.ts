import { Attribute } from "https://deno.land/x/otel_common_api@v1.0.0/attribute.ts";
import { SpanAPI, SpanAttributes } from "./span-api.ts";
import { SpanContext, getTraceId } from "./span-context.ts";
import { EventAttributes, SpanEvent } from "./span-event.ts";
import { SpanKind } from "./span-kind.ts";
import { LinkAttributes, SpanLink } from "./span-link.ts";
import { SpanStatus, StatusCode } from "./span-status.ts";
import { Timestamp } from "./types.ts";
import { IdGenerator, getEmptyTraceState } from "./deps.ts";

type BaseSpanProperties = {
  name: string;
  parent: SpanAPI | null;
  kind: SpanKind;
  start: Timestamp;
  attributes?: SpanAttributes;
  links?: SpanLink[];
  idGenerator: IdGenerator;
};

type ChildSpanProperties = BaseSpanProperties & {
  parent: SpanAPI;
};

const isChildSpan = (
  props: BaseSpanProperties | ChildSpanProperties
): props is ChildSpanProperties => "parent" in props;

export class Span implements SpanAPI {
  name: string;
  spanContext: SpanContext;
  parent: SpanAPI | null;
  spanKind: SpanKind;
  start: number;
  end: number | null;
  attributes: SpanAttributes;
  links: SpanLink[];
  events: SpanEvent[];
  status: SpanStatus;
  isRecording: boolean;

  constructor(properties: BaseSpanProperties | ChildSpanProperties) {
    const {
      name,
      kind,
      start,
      attributes = new SpanAttributes(),
      links = [],
    } = properties;
    this.name = name;

    this.spanKind = kind;
    this.start = start;
    this.end = null;
    this.attributes = attributes;
    this.links = links;
    this.events = [];
    this.status = { code: StatusCode.UNSET };
    this.isRecording = true;

    if (isChildSpan(properties)) {
      this.parent = properties.parent;
      const parentContext = properties.parent.getSpanContext();
      this.spanContext = {
        traceId: getTraceId(parentContext, "bin"),
        parentId: properties.idGenerator.generateSpanIdBytes(),
        traceFlags: parentContext.traceFlags,
        traceState: parentContext.traceState,
        isRemote: false,
      };
    } else {
      this.parent = null;
      this.spanContext = {
        traceId: properties.idGenerator.generateTraceIdBytes(),
        parentId: properties.idGenerator.generateSpanIdBytes(),
        traceFlags: 0,
        traceState: getEmptyTraceState(),
        isRemote: false,
      };
    }
  }

  getSpanContext(): SpanContext {
    return this.spanContext;
  }

  setAttribute(key: string, value: Attribute["value"]): void {
    this.attributes.setAttribute(key, value);
  }

  setAttributes(attributes: Attribute[]): void {
    this.attributes.addAttributes(attributes);
  }

  addLink(spanContext: SpanContext, attributes = new LinkAttributes()): void {
    this.links.push({ spanContext, attributes });
    throw new Error("Method not implemented.");
  }

  addEvent(
    name: string,
    eventTime: Timestamp = Date.now(),
    attributes = new EventAttributes()
  ): void {
    this.events.push({ name, eventTime, attributes });
  }

  recordException(exception: Error, attributes = new EventAttributes()): void {
    this.addEvent(exception.message, Date.now(), attributes);
  }

  /* Spec: https://opentelemetry.io/docs/specs/otel/trace/api/#set-status */
  setStatus(code: StatusCode, message?: string | undefined): void {
    if (this.status.code === StatusCode.OK) {
      return;
    }
    switch (code) {
      case StatusCode.UNSET:
        return;
      case StatusCode.OK:
        this.status = { code };
        return;
      case StatusCode.ERROR:
        this.status = { code, description: message };
        return;
    }
  }

  updateName(name: string): void {
    this.name = name;
  }

  endSpan(endTime?: number | undefined): void {
    this.end = endTime ?? Date.now();
    this.isRecording = false;
  }
}
