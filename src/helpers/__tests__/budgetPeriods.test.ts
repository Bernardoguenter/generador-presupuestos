import { describe, expect, it } from "vitest";
import {
  getBudgetPeriodLabel,
  getBudgetPeriodRange,
  toDateInputValue,
} from "../budgetPeriods";

const now = new Date(2026, 10, 9, 15, 30); // 9/11/2026 15:30

describe("getBudgetPeriodRange", () => {
  it("últimos 7 días incluye hoy y los 6 anteriores", () => {
    const { from, to } = getBudgetPeriodRange("7d", undefined, now);
    expect(from).toEqual(new Date(2026, 10, 3));
    expect(to).toEqual(new Date(2026, 10, 10));
  });

  it("últimos 30 días", () => {
    const { from, to } = getBudgetPeriodRange("30d", undefined, now);
    expect(from).toEqual(new Date(2026, 9, 11));
    expect(to).toEqual(new Date(2026, 10, 10));
  });

  it("un día elegido", () => {
    const { from, to } = getBudgetPeriodRange("day", "2026-11-05", now);
    expect(from).toEqual(new Date(2026, 10, 5));
    expect(to).toEqual(new Date(2026, 10, 6));
  });
});

describe("textos", () => {
  it("fecha para el input y etiqueta", () => {
    expect(toDateInputValue(now)).toBe("2026-11-09");
    expect(getBudgetPeriodLabel("7d")).toBe("en los últimos 7 días");
    expect(getBudgetPeriodLabel("day", "2026-11-05")).toBe("el 05/11/2026");
  });
});
