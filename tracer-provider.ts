import { Tracer, TracerOptions } from "./tracer.ts";

export class TracerProvider {
  private tracers: Map<string, Tracer> = new Map();

  getTracer(name: string, options: TracerOptions = {}): Tracer {
    const tracerKey = [
      name,
      options.version ?? "",
      options.schema_url ?? "",
    ].join(":");
    if (!this.tracers.has(tracerKey)) {
      this.tracers.set(tracerKey, new Tracer(name, options));
    }

    return this.tracers.get(tracerKey)!;
  }
}
