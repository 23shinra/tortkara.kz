"use client";

import type { ProductSpecs } from "@/lib/products-meta";

type SliderConfig = {
  key: keyof ProductSpecs;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** allow second value like 44/56м */
  dual?: boolean;
};

const SLIDERS: SliderConfig[] = [
  { key: "year", label: "Год выпуска", min: 2005, max: 2026, step: 1, unit: "" },
  { key: "depth", label: "Глубина бурения", min: 20, max: 120, step: 1, unit: "м", dual: true },
  {
    key: "diameter",
    label: "Диаметр бурения",
    min: 800,
    max: 3200,
    step: 50,
    unit: "мм",
    dual: true,
  },
  { key: "power", label: "Мощность", min: 50, max: 500, step: 1, unit: "кВт" },
  { key: "weight", label: "Масса", min: 20, max: 200, step: 1, unit: "т" },
];

const CONDITION_OPTIONS = [
  "Б/У, восстановленный",
  "Б/У, не восстановленный",
  "Новый",
];

const MAST_OPTIONS = ["тросовой", "гидравлический", "телескопический"];

function parseNums(raw: string | undefined): number[] {
  if (!raw) return [];
  return (raw.match(/\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(",", "."))).filter((n) => !Number.isNaN(n));
}

function formatValue(nums: number[], unit: string, dual: boolean) {
  const clean = nums.filter((n) => n > 0);
  if (!clean.length) return "";
  if (dual && clean.length >= 2) {
    return `${clean[0]}/${clean[1]}${unit}`;
  }
  const n = clean[0];
  if (!unit) return String(n);
  if (unit === "кВт") return `${n} ${unit}`;
  return `${n}${unit}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type Props = {
  specs: ProductSpecs;
  onChange: (next: ProductSpecs) => void;
};

export function SpecFields({ specs, onChange }: Props) {
  function setSpec(key: keyof ProductSpecs, value: string) {
    onChange({ ...specs, [key]: value });
  }

  return (
    <div className="admin-specs">
      <div className="admin-form-grid">
        <div>
          <label className="admin-label" htmlFor="spec-condition">
            Состояние
          </label>
          <select
            id="spec-condition"
            className="admin-select"
            value={specs.condition || ""}
            onChange={(e) => setSpec("condition", e.target.value)}
          >
            <option value="">Не указано</option>
            {CONDITION_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label" htmlFor="spec-mast">
            Мачта
          </label>
          <select
            id="spec-mast"
            className="admin-select"
            value={specs.mast || ""}
            onChange={(e) => setSpec("mast", e.target.value)}
          >
            <option value="">Не указано</option>
            {MAST_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-form-grid" style={{ marginTop: "1rem" }}>
        {SLIDERS.map((cfg) => (
          <SliderField
            key={cfg.key}
            config={cfg}
            value={specs[cfg.key] || ""}
            onChange={(v) => setSpec(cfg.key, v)}
          />
        ))}
      </div>

      <div className="admin-form-grid" style={{ marginTop: "1rem" }}>
        <div>
          <label className="admin-label" htmlFor="spec-engine">
            Двигатель
          </label>
          <input
            id="spec-engine"
            className="admin-input"
            value={specs.engine || ""}
            onChange={(e) => setSpec("engine", e.target.value)}
            placeholder="Cummins QSB7"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="spec-kelly">
            Келли-штанга
          </label>
          <input
            id="spec-kelly"
            className="admin-input"
            value={specs.kelly || ""}
            onChange={(e) => setSpec("kelly", e.target.value)}
            placeholder="377-4х12.5"
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="admin-label" htmlFor="spec-transport">
            Габариты (транспорт)
          </label>
          <input
            id="spec-transport"
            className="admin-input"
            value={specs.transport || ""}
            onChange={(e) => setSpec("transport", e.target.value)}
            placeholder="13993х2960х3464мм"
          />
        </div>
      </div>
    </div>
  );
}

function SliderField({
  config,
  value,
  onChange,
}: {
  config: SliderConfig;
  value: string;
  onChange: (v: string) => void;
}) {
  const nums = parseNums(value);
  const primary = nums[0] ?? config.min;
  const secondary = nums[1];
  const dualOn = Boolean(config.dual && secondary != null);

  function commit(a: number, b?: number) {
    const first = clamp(a, config.min, config.max);
    if (config.dual && b != null) {
      onChange(formatValue([first, clamp(b, config.min, config.max)], config.unit, true));
      return;
    }
    onChange(formatValue([first], config.unit, false));
  }

  function onPrimaryInput(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) {
      onChange("");
      return;
    }
    commit(Number(digits), dualOn ? secondary : undefined);
  }

  function onSecondaryInput(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) {
      commit(primary);
      return;
    }
    commit(primary, Number(digits));
  }

  const hasValue = nums[0] != null;
  const p1 = clamp(primary, config.min, config.max);
  const p2 = clamp(secondary ?? primary, config.min, config.max);
  const pct1 = ((p1 - config.min) / (config.max - config.min)) * 100;
  const pct2 = ((p2 - config.min) / (config.max - config.min)) * 100;

  return (
    <div className={`admin-slider-field${hasValue ? " has-value" : ""}`}>
      <div className="admin-slider-head">
        <div>
          <label className="admin-label" htmlFor={`spec-${config.key}`}>
            {config.label}
          </label>
          <p className="admin-slider-current">
            {value || "Не задано"}
          </p>
        </div>
        <div className="admin-slider-values">
          <div className="admin-slider-input-wrap">
            <input
              id={`spec-${config.key}`}
              className="admin-input admin-slider-num"
              inputMode="numeric"
              value={nums[0] != null ? String(nums[0]) : ""}
              onChange={(e) => onPrimaryInput(e.target.value)}
              placeholder="—"
            />
            {config.unit ? <span className="admin-slider-unit">{config.unit}</span> : null}
          </div>
          {config.dual ? (
            <>
              <button
                type="button"
                className={`admin-slider-dual-btn${dualOn ? " is-on" : ""}`}
                onClick={() => {
                  if (dualOn) commit(primary);
                  else commit(primary, Math.min(config.max, primary + Math.round((config.max - config.min) * 0.1)));
                }}
              >
                {dualOn ? "1 значение" : "+ 2-е"}
              </button>
              {dualOn ? (
                <div className="admin-slider-input-wrap">
                  <span className="admin-slider-sep">/</span>
                  <input
                    className="admin-input admin-slider-num"
                    inputMode="numeric"
                    value={secondary != null ? String(secondary) : ""}
                    onChange={(e) => onSecondaryInput(e.target.value)}
                    placeholder="—"
                  />
                  {config.unit ? <span className="admin-slider-unit">{config.unit}</span> : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="admin-range-wrap">
        <input
          type="range"
          className="admin-range"
          style={{ ["--progress" as string]: `${pct1}%` }}
          min={config.min}
          max={config.max}
          step={config.step}
          value={p1}
          onChange={(e) => commit(Number(e.target.value), dualOn ? secondary : undefined)}
        />
      </div>
      {dualOn ? (
        <div className="admin-range-wrap admin-range-wrap-secondary">
          <input
            type="range"
            className="admin-range admin-range-secondary"
            style={{ ["--progress" as string]: `${pct2}%` }}
            min={config.min}
            max={config.max}
            step={config.step}
            value={p2}
            onChange={(e) => commit(primary, Number(e.target.value))}
          />
        </div>
      ) : null}
      <div className="admin-slider-scale">
        <span>
          {config.min}
          {config.unit}
        </span>
        <span>
          {config.max}
          {config.unit}
        </span>
      </div>
    </div>
  );
}
