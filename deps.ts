export {
  type ContextAPI,
  createContextKey,
  ContextBuilder,
} from "https://deno.land/x/otel_context_api@v1.2.2/mod.ts";
export {
  type TraceState,
  getEmptyTraceState,
} from "https://deno.land/x/w3_trace_state@v1.1.0/mod.ts";
export {
  W3TraceContext,
  type TraceContext,
  TraceFlags,
} from "https://deno.land/x/w3_trace_context@v1.2.0/mod.ts";
import { type TextMapPropagator } from "https://deno.land/x/otel_text_map_propagator@v1.0.2/mod.ts";
import {
  type SetterFunction,
  type GetterFunction,
} from "https://deno.land/x/otel_text_map_propagator@v1.0.2/text-map-propagator.ts";
export {
  type Attribute,
  AttributeCollection,
} from "https://deno.land/x/otel_common_api@v1.0.0/mod.ts";
export { type IdGenerator } from "https://deno.land/x/w3_trace_id_generator@v1.0.1/mod.ts";

export { TextMapPropagator, SetterFunction, GetterFunction };
