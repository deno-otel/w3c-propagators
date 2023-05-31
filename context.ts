import { createContextKey, type ContextAPI } from "./deps.ts";
import { SpanAPI } from "./span-api.ts";

const SPAN_KEY = createContextKey("Span Key");

/**
 * Extract the current Span from the current Context
 */
export const getSpan = (context: ContextAPI): SpanAPI | null => {
  return (context.getValue(SPAN_KEY) as SpanAPI) ?? null;
};

/**
 * Injects a Span into the current Context
 */
export const addSpan = (context: ContextAPI, span: SpanAPI) => {
  return context.setValue(SPAN_KEY, span);
};
