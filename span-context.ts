import { TraceContext } from "./deps.ts";

export const getHexstring = (uArray: Uint8Array) => {
  return [...uArray]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .padStart(uArray.length * 2, "0");
};

export interface SpanContext extends Omit<Readonly<TraceContext>, "parentId"> {
  readonly spanId: TraceContext["parentId"];
  readonly isRemote: boolean;
}

/**
 * Gets the Trace ID from a SpanContext as either a hex string or an array of 16 bytes
 */
export function getTraceId(context: SpanContext, format: "hex"): string;
export function getTraceId(context: SpanContext, format: "bin"): Uint8Array;
export function getTraceId(context: SpanContext): string;
export function getTraceId(
  context: SpanContext,
  format: "hex" | "bin" = "hex"
): Uint8Array | string {
  const { traceId } = context;

  return format === "bin" ? new Uint8Array(traceId) : getHexstring(traceId);
}

/**
 * Gets the Span ID from a SpanContext as either a hex string or an array of 8 bytes
 */
export function getSpanId(context: SpanContext, format: "hex"): string;
export function getSpanId(context: SpanContext, format: "bin"): Uint8Array;
export function getSpanId(context: SpanContext): string;
export function getSpanId(
  context: SpanContext,
  format: "hex" | "bin" = "hex"
): Uint8Array | string {
  const { spanId } = context;

  return format === "bin" ? new Uint8Array(spanId) : getHexstring(spanId);
}

/**
 * Returns true if the Trace ID and Span ID in a SpanContext are valid
 */
export function isValid(context: SpanContext) {
  const traceId = getTraceId(context, "bin");
  const spanId = getSpanId(context, "bin");
  return (
    spanId.length === 8 &&
    spanId.some((byte) => byte !== 0) &&
    traceId.length === 16 &&
    traceId.some((byte) => byte !== 0)
  );
}
