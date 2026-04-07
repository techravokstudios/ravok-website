"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RatingScale } from "../_components/RatingScale";
import {
  writerQuestions,
  directorQuestions,
  producerQuestions,
  type FormQuestion,
} from "../_components/formQuestions";

type FormType = "writer" | "director" | "producer";

function questionsForType(t: FormType): FormQuestion[] {
  if (t === "writer") return writerQuestions;
  if (t === "director") return directorQuestions;
  return producerQuestions;
}

function titleForType(t: FormType) {
  if (t === "writer") return "Writer Submission";
  if (t === "director") return "Director Submission";
  return "Producer / Executive Submission";
}

export default function PitchFormPage() {
  const params = useParams();
  const router = useRouter();
  const rawType = (params?.type as string | undefined)?.toLowerCase();
  const t: FormType =
    rawType === "writer" || rawType === "director" || rawType === "producer"
      ? rawType
      : "writer";

  const questions = useMemo(() => questionsForType(t), [t]);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function setValue(id: string, val: string | number | boolean) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  // Progress
  const filled = useMemo(() => {
    return questions.filter((q) => {
      const v = answers[q.id];
      if (v === undefined || v === "" || v === false) return false;
      return true;
    }).length;
  }, [answers, questions]);
  const pct = Math.round((filled / questions.length) * 100);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const q of questions) {
      if (!q.required) continue;
      const v = answers[q.id];
      if (v === undefined || v === "" || v === false || v === 0) {
        errs[q.id] = "Required";
      }
      if (q.type === "email" && v && typeof v === "string" && !v.includes("@")) {
        errs[q.id] = "Invalid email";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      // Scroll to first error
      const firstErr = Object.keys(errors)[0] || questions.find((q) => q.required && !answers[q.id])?.id;
      if (firstErr) {
        document.getElementById(`field-${firstErr}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      // Build submission data
      const name = (answers["name"] as string) || "";
      const email = (answers["email"] as string) || "";
      const data: Record<string, string | number | boolean> = {};
      for (const q of questions) {
        if (q.id !== "name" && q.id !== "email") {
          data[q.label] = answers[q.id] ?? "";
        }
      }

      // Try API first
      const { submitPublicForm } = await import("@/lib/api/v1/forms");
      await submitPublicForm(t, { name, email, data: data as Record<string, any> });

      setSubmitted(true);
    } catch {
      // Fallback: build mailto
      const name = (answers["name"] as string) || "Unknown";
      const subject = encodeURIComponent(`[${t.toUpperCase()} SUBMISSION] ${name}`);
      const bodyLines = questions.map((q) => `${q.label}: ${answers[q.id] ?? "(empty)"}`).join("\n\n");
      const body = encodeURIComponent(bodyLines);
      window.location.href = `mailto:contact@ravokstudios.com?subject=${subject}&body=${body}`;
    } finally {
      setSubmitting(false);
    }
  }

  function renderField(q: FormQuestion) {
    const val = answers[q.id];
    const hasError = !!errors[q.id];
    const baseInput = `w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder:text-ravok-slate/50 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ravok-gold/50 focus:border-ravok-gold/50 transition-colors ${
      hasError ? "border-red-500/50" : "border-white/10"
    }`;

    switch (q.type) {
      case "text":
      case "url":
      case "email":
        return (
          <input
            type={q.type === "url" ? "url" : q.type === "email" ? "email" : "text"}
            value={(val as string) || ""}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            className={baseInput}
          />
        );

      case "textarea":
        return (
          <textarea
            rows={3}
            value={(val as string) || ""}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            className={`${baseInput} resize-none`}
          />
        );

      case "select":
        return (
          <select
            value={(val as string) || ""}
            onChange={(e) => setValue(q.id, e.target.value)}
            className={`${baseInput} bg-black/30`}
          >
            <option value="" className="bg-black">Select an option</option>
            {q.options?.map((opt) => (
              <option key={opt} value={opt} className="bg-black">{opt}</option>
            ))}
          </select>
        );

      case "rating5":
        return (
          <RatingScale
            max={5}
            value={(val as number) || 0}
            onChange={(v) => setValue(q.id, v)}
            lowLabel={q.lowLabel}
            highLabel={q.highLabel}
          />
        );

      case "rating10":
        return (
          <RatingScale
            max={10}
            value={(val as number) || 0}
            onChange={(v) => setValue(q.id, v)}
            lowLabel={q.lowLabel}
            highLabel={q.highLabel}
          />
        );

      case "yesno":
        return (
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setValue(q.id, opt)}
                className={`px-6 py-2 rounded-lg border font-sans text-sm transition-all ${
                  val === opt
                    ? "bg-ravok-gold border-ravok-gold text-black font-medium"
                    : "border-white/20 text-white/60 hover:border-ravok-gold/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!val}
              onChange={(e) => setValue(q.id, e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 accent-ravok-gold"
            />
            <span className="font-sans text-sm text-white/80 group-hover:text-white transition-colors">
              {q.label}
            </span>
          </label>
        );

      default:
        return null;
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-6 pt-32 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-ravok-gold mx-auto mb-6" />
            <h1 className="font-heading text-4xl text-white mb-4">Submission Received</h1>
            <p className="font-sans text-ravok-slate mb-8">
              Thank you for your {t} submission. Our team will review it and get back to you.
            </p>
            <Link
              href="/pitch-us"
              className="inline-block bg-ravok-gold text-black px-8 py-3 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors"
            >
              Back to Pitch Us
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/pitch-us"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-ravok-slate hover:text-ravok-gold transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Pitch Us
          </Link>

          <h1 className="text-4xl sm:text-5xl font-heading text-ravok-gold leading-tight mb-2">
            {titleForType(t)}
          </h1>
          <p className="font-sans text-sm text-ravok-slate mb-1">
            Fields marked with <span className="text-ravok-gold">*</span> are required.
          </p>
          <div className="mt-4 h-0.5 w-16 bg-ravok-gold mb-8" />
        </motion.div>

        {/* Progress bar */}
        <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl py-3 mb-6 -mx-6 px-6 border-b border-white/5">
          <div className="flex items-center justify-between font-sans text-xs text-ravok-slate mb-2">
            <span>{filled}/{questions.length} completed</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-ravok-gold rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              id={`field-${q.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
            >
              {q.type !== "checkbox" && (
                <label className="block font-sans text-sm font-medium text-white mb-2">
                  <span className="text-ravok-slate font-normal mr-2">{i + 1}.</span>
                  {q.label}
                  {q.required && <span className="text-ravok-gold ml-1">*</span>}
                  {!q.required && q.helperText && (
                    <span className="text-ravok-slate/60 font-normal ml-2 text-xs">({q.helperText})</span>
                  )}
                </label>
              )}
              {q.helperText && q.type !== "checkbox" && q.required && (
                <p className="font-sans text-xs text-ravok-slate/60 mb-2">{q.helperText}</p>
              )}
              {renderField(q)}
              {errors[q.id] && (
                <p className="font-sans text-xs text-red-400 mt-1">{errors[q.id]}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-ravok-gold text-black px-8 py-4 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
          <p className="font-sans text-xs text-ravok-slate/60 text-center mt-4">
            By submitting, your information will be reviewed by the RAVOK development team. We typically respond within 2-4 weeks.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
