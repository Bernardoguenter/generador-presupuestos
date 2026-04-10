import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna el valor inicial de inmediato", () => {
    const { result } = renderHook(() => useDebounce("inicial", 300));
    expect(result.current).toBe("inicial");
  });

  it("no actualiza el valor antes de que expire el delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "inicial" } }
    );

    rerender({ value: "actualizado" });

    // No ha pasado el tiempo suficiente
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("inicial");
  });

  it("actualiza el valor después del delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "inicial" } }
    );

    rerender({ value: "actualizado" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("actualizado");
  });

  it("respeta un delay personalizado", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "inicial" } }
    );

    rerender({ value: "nuevo" });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("inicial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("nuevo");
  });

  it("cancela el timer previo si el valor cambia rápidamente", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: "c" });
    act(() => { vi.advanceTimersByTime(300); });

    // Sólo debe aplicar el último valor
    expect(result.current).toBe("c");
  });
});
