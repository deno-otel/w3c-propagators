import { addSpan, getSpan, NonRecordingSpan, SpanContext } from "./deps.ts";
import {
  addTraceStateValue,
  assertEquals,
  assertNotEquals,
  Context,
  describe,
  getEmptyTraceState,
  getTraceStateValue,
  it,
} from "./dev_deps.ts";
import { W3CTraceContextPropagator } from "./w3c-trace-context-propagator.ts";

describe("W3CTraceContextPropagator", () => {
  describe("fields", () => {
    it("returns the fields", () => {
      const propagator = new W3CTraceContextPropagator();
      assertEquals(propagator.fields(), ["tracestate", "traceparent"]);
    });
  });

  describe("inject", () => {
    it("is a no-op if the context does not contain a span", () => {
      const context = new Context();
      const headers = new Headers();

      const propagator = new W3CTraceContextPropagator();
      propagator.inject(context, headers);
      assertEquals(headers.get("traceparent"), null);
      assertEquals(headers.get("tracestate"), null);
    });

    it("inserts traceparent and tracestate", () => {
      const spanContext = new SpanContext(
        new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
        new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
        0,
        addTraceStateValue(getEmptyTraceState(), "foo", "bar"),
        false,
      );
      const contextSpan = NonRecordingSpan.fromSpanContext(spanContext);
      const context = addSpan(new Context(), contextSpan);

      const headers = new Headers();

      const propagator = new W3CTraceContextPropagator();
      propagator.inject(context, headers);
      assertEquals(
        headers.get("traceparent"),
        "00-000102030405060708090a0b0c0d0e0f-0001020304050607-00",
      );
      assertEquals(headers.get("tracestate"), "foo=bar");
    });
  });

  describe("extract", () => {
    it("is a no-op if the headers don't contain trace info", () => {
      const headers = new Headers();

      const propagator = new W3CTraceContextPropagator();
      const context = propagator.extract(new Context(), headers);

      const span = getSpan(context);
      assertEquals(span, null);
    });

    it("extracts traceparent and tracestate", () => {
      const headers = new Headers();
      headers.set(
        "traceparent",
        "00-000102030405060708090a0b0c0d0e0f-0001020304050607-00",
      );
      headers.set("tracestate", "foo=bar");

      const propagator = new W3CTraceContextPropagator();
      const context = propagator.extract(new Context(), headers);
      const span = getSpan(context);
      assertNotEquals(span, null);
      const spanContext = span?.getSpanContext();
      assertEquals(
        spanContext!.getTraceId(),
        "000102030405060708090a0b0c0d0e0f",
      );
      assertEquals(spanContext!.getSpanId(), "0001020304050607");
      assertEquals(spanContext?.traceFlags, 0);
      assertEquals(spanContext?.isRemote, true);
      assertEquals(getTraceStateValue(spanContext!.traceState, "foo"), "bar");
    });
  });
});
