"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, transitions } from "@/lib/motion-tokens";

type ProjectType = "commercial" | "industrial" | "interior" | "renovation";
type SizeTier = "small" | "medium" | "large" | "xl";
type QualityTier = "standard" | "premium" | "luxury";

interface EstimateConfig {
  projectType: ProjectType | null;
  size: SizeTier | null;
  quality: QualityTier | null;
}

const projectTypes: { value: ProjectType; label: string; desc: string }[] = [
  { value: "commercial", label: "Commercial Facility", desc: "Office buildings, corporate HQ, business parks" },
  { value: "industrial", label: "Industrial / Warehouse", desc: "Distribution centers, manufacturing spaces" },
  { value: "interior", label: "Interior Fit-Out", desc: "Tenant improvements, office renovations" },
  { value: "renovation", label: "Renovation", desc: "Building upgrades, expansions, retrofits" },
];

const sizeOptions: { value: SizeTier; label: string; sqft: string }[] = [
  { value: "small", label: "Small", sqft: "< 5,000 sq ft" },
  { value: "medium", label: "Medium", sqft: "5,000 – 20,000 sq ft" },
  { value: "large", label: "Large", sqft: "20,000 – 50,000 sq ft" },
  { value: "xl", label: "Extra Large", sqft: "50,000+ sq ft" },
];

const qualityTiers: { value: QualityTier; label: string; desc: string }[] = [
  { value: "standard", label: "Standard", desc: "Functional finishes, efficient timelines" },
  { value: "premium", label: "Premium", desc: "Higher-grade materials, design-forward" },
  { value: "luxury", label: "Luxury", desc: "Custom architecture, top-tier finishes" },
];

const baseRates: Record<ProjectType, number> = {
  commercial: 180,
  industrial: 120,
  interior: 150,
  renovation: 200,
};

const sizeMultiplier: Record<SizeTier, number> = {
  small: 1,
  medium: 3.5,
  large: 7,
  xl: 14,
};

const qualityMultiplier: Record<QualityTier, number> = {
  standard: 1,
  premium: 1.5,
  luxury: 2.2,
};

function formatRange(config: EstimateConfig): { low: string; high: string } | null {
  if (!config.projectType || !config.size || !config.quality) return null;
  const base = baseRates[config.projectType];
  const size = sizeMultiplier[config.size];
  const qual = qualityMultiplier[config.quality];
  const raw = base * size * qual;
  const low = Math.round(raw * 0.85);
  const high = Math.round(raw * 1.15);
  const fmt = (n: number) =>
    n >= 1000
      ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}M`
      : `$${(n / 1000).toFixed(0)}K`;
  return { low: fmt(low), high: fmt(high) };
}

const steps = ["Project Type", "Size", "Quality"] as const;

export function BudgetEstimator() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<EstimateConfig>({
    projectType: null,
    size: null,
    quality: null,
  });

  const range = formatRange(config);
  const allSelected = config.projectType && config.size && config.quality;

  const select = (value: ProjectType | SizeTier | QualityTier) => {
    const key = steps[step].toLowerCase() as "projecttype" | "size" | "quality";
    setConfig((prev) => ({ ...prev, [key]: value as never }));
    if (step < 2) {
      setTimeout(() => setStep((s) => s + 1), 250);
    }
  };

  const reset = () => {
    setStep(0);
    setConfig({ projectType: null, size: null, quality: null });
  };

  const canProceed =
    (step === 0 && config.projectType) ||
    (step === 1 && config.size) ||
    (step === 2 && config.quality);

  return (
    <section data-testid="budget-estimator" className="bg-stone-50 py-20 dark:bg-slate-950 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-center text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50"
        >
          Project Budget Estimator
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.05 }}
          className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-slate-700 dark:text-slate-300"
        >
          Select your project details to receive a preliminary budget range.
          Final pricing depends on site conditions and scope.
        </motion.p>

        {/* Step indicator */}
        <div className="mx-auto mt-12 flex max-w-md items-center justify-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => setStep(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i === step
                    ? "bg-amber-700 text-white dark:bg-amber-500 dark:text-slate-950"
                    : i < step
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {i + 1}
              </button>
              <span
                className={`hidden text-xs font-medium sm:inline ${
                  i === step
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1 h-px w-6 ${
                    i < step ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="relative mt-10 min-h-[220px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={transitions.normal}
                className="grid gap-4 sm:grid-cols-2"
              >
                {projectTypes.map((pt) => (
                  <button
                    key={pt.value}
                    onClick={() => select(pt.value)}
                    className={`rounded-lg border-2 px-5 py-4 text-left transition-all ${
                      config.projectType === pt.value
                        ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20"
                        : "border-slate-200 bg-white hover:border-amber-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-600"
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-950 dark:text-slate-50">{pt.label}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{pt.desc}</div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={transitions.normal}
                className="grid gap-4 sm:grid-cols-4"
              >
                {sizeOptions.map((sz) => (
                  <button
                    key={sz.value}
                    onClick={() => select(sz.value)}
                    className={`rounded-lg border-2 px-4 py-4 text-center transition-all ${
                      config.size === sz.value
                        ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20"
                        : "border-slate-200 bg-white hover:border-amber-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-600"
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-950 dark:text-slate-50">{sz.label}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{sz.sqft}</div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={transitions.normal}
                className="grid gap-4 sm:grid-cols-3"
              >
                {qualityTiers.map((qt) => (
                  <button
                    key={qt.value}
                    onClick={() => select(qt.value)}
                    className={`rounded-lg border-2 px-5 py-5 text-center transition-all ${
                      config.quality === qt.value
                        ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20"
                        : "border-slate-200 bg-white hover:border-amber-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-600"
                    }`}
                  >
                    <div className="text-base font-bold text-slate-950 dark:text-slate-50">{qt.label}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{qt.desc}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result */}
        {range && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitions.normal}
            className="mx-auto mt-8 max-w-md rounded-xl border-2 border-amber-500 bg-white p-6 text-center dark:bg-slate-900"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Estimated Budget Range
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {range.low} – {range.high}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Preliminary estimate only · Final pricing varies by site conditions
            </p>
            <button
              onClick={reset}
              className="mt-4 text-sm font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
