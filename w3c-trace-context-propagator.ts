import {
  addSpan,
  ContextAPI,
  getSpan,
  NonRecordingSpan,
  SpanContext,
  TextMapPropagator,
  TraceFlags,
  W3TraceContext,
} from "./deps.ts";

export class W3CTraceContextPropagator implements TextMapPropagator<Headers> {
  inject(context: ContextAPI, carrier: Headers): void {
    const span = getSpan(context);
    if (span === null) {
      return;
    }
    const { traceId, traceFlags, spanId, traceState } = span.getSpanContext();

    const traceContext = W3TraceContext.fromTraceData(
      {
        version: 0,
        traceId,
        sampled: traceFlags === TraceFlags.SAMPLED,
        parentId: spanId,
        extraFields: [],
      },
      traceState,
    );

    const newHeaders = traceContext.toHeaders();

    carrier.set("traceparent", newHeaders.get("traceparent")!);
    carrier.set("tracestate", newHeaders.get("tracestate")!);
  }
  extract(context: ContextAPI, carrier: Headers): ContextAPI {
    if (
      carrier.get("traceparent") === null ||
      carrier.get("tracestate") === null
    ) {
      return context;
    }
    const traceContext = W3TraceContext.fromHeaders(carrier);
    const { traceId, parentId, traceState, sampled } = traceContext;

    const spanContext: SpanContext = {
      traceId,
      spanId: parentId,
      traceFlags: sampled ? TraceFlags.SAMPLED : TraceFlags.NONE,
      traceState: traceState,
      isRemote: true,
    };

    const contextSpan = NonRecordingSpan.fromSpanContext(spanContext);

    return addSpan(context, contextSpan);
  }

  fields(): string[] {
    return ["tracestate", "traceparent"];
  }
}
