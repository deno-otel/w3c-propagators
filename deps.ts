/**
 * W3C Trace Context and Trace State
 */
export { type TraceState } from "https://deno.land/x/w3_trace_state@v1.1.0/mod.ts";
export {
  TraceFlags,
  type TraceParentData,
  W3TraceContext,
} from "https://deno.land/x/w3_trace_context@v1.4.1/mod.ts";

/**
 * OpenTelemetry Context API
 */
export { type ContextAPI } from "https://deno.land/x/otel_context_api@v1.2.2/mod.ts";

/**
 * OpenTelemetry Propagator API
 */
export { type TextMapPropagator } from "https://deno.land/x/otel_text_map_propagator@v1.0.2/mod.ts";

/**
 * OpenTelemetry Tracing API
 */
export {
  addSpan,
  getSpan,
} from "https://deno.land/x/otel_tracing_api@v0.0.3/context.ts";
export { type SpanContext } from "https://deno.land/x/otel_tracing_api@v0.0.3/span-context.ts";
export { NonRecordingSpan } from "https://deno.land/x/otel_tracing_api@v0.0.3/non-recording-span.ts";
