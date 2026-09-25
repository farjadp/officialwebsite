"use client";

import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getNpiQuestions, NpiLocale, QuestionDef } from '@/lib/npi/data';
import { getNpiUiStrings, NpiAction, NpiUiStrings } from '@/lib/npi/ui';
import { submitNPIPlanLead } from '@/actions/npi-assessment';
import { Check, Download } from 'lucide-react';
import {
  QuestionBlock,
  ScaleOptions,
  StepIn,
  ToolButton,
  ToolField,
  ToolIntro,
  ToolPanel,
  ToolProgress,
} from '@/components/v3/tool-kit';

// --- Schema ---
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const makeLeadSchema = (ui: NpiUiStrings) =>
  z.object({
    name: z.string().min(2, ui.nameRequired),
    email: z.string().email(ui.emailInvalid),
    role: z.string().optional(),
    agreed: z.boolean(),
  });
type LeadFormValues = z.infer<ReturnType<typeof makeLeadSchema>>;

/** Back to the top of the tool; instant when the visitor prefers reduced motion. */
function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
}

/** A checkbox group in the ScaleOptions look: each option toggles on its own. */
function MultiOptions({
  options,
  selected,
  onToggle,
  labelledBy,
  max,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  labelledBy: string;
  max?: number;
}) {
  const full = max !== undefined && selected.length >= max;
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-col gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        const blocked = full && !isSelected;
        return (
          <button
            key={opt}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-disabled={blocked || undefined}
            onClick={() => onToggle(opt)}
            className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm font-medium leading-snug transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light ${
              isSelected
                ? 'border-v3-light bg-v3-light/10 text-v3-bone shadow-[0_0_30px_-12px_rgba(232,196,138,0.8)]'
                : blocked
                  ? 'cursor-not-allowed border-v3-line bg-v3-raise text-v3-mute'
                  : 'border-v3-line bg-v3-raise text-v3-soft hover:border-v3-mute hover:text-v3-bone'
            }`}
          >
            <span
              aria-hidden
              className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                isSelected ? 'border-v3-light bg-v3-light text-v3-ink' : 'border-v3-mute'
              }`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(t => (
        <li key={t} className="rounded-full border border-v3-line px-3 py-1 text-sm text-v3-bone">{t}</li>
      ))}
    </ul>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-v3-line/60 py-4 last:border-b-0 sm:flex-row sm:gap-6">
      <dt className="shrink-0 text-sm text-v3-mute sm:w-36">{label}</dt>
      <dd className="leading-relaxed text-v3-bone rtl:leading-loose">{children}</dd>
    </div>
  );
}

function Pillar({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-v3-line/80 p-6 md:p-8">
      <h3 className="mb-4 text-sm font-medium text-v3-light">{heading}</h3>
      {children}
    </section>
  );
}

export function NPIAssessmentTool({ locale = 'en' }: { locale?: NpiLocale }) {
  const ui = getNpiUiStrings(locale);
  const questions = useMemo(() => getNpiQuestions(locale), [locale]);
  const leadSchema = useMemo(() => makeLeadSchema(ui), [ui]);

  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { agreed: true }
  });

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, 6) as Step);
    scrollToTop();
  };
  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1) as Step);
    scrollToTop();
  };

  const handleSingleSelect = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleMultiSelect = (qId: string, val: string, max?: number) => {
    setAnswers(prev => {
      const current = (prev[qId] as string[]) || [];
      if (current.includes(val)) {
        return { ...prev, [qId]: current.filter(v => v !== val) };
      }
      if (max && current.length >= max) return prev; // Limit reached
      return { ...prev, [qId]: [...current, val] };
    });
  };

  const handleTextChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  // Check if step is valid (all required fields filled)
  const isStepValid = () => {
    if (step === 2) {
      return !!answers['q1'] && !!answers['q2'] && (answers['q3'] as string[])?.length > 0 && (answers['q4'] as string[])?.length >= 3;
    }
    if (step === 3) {
      return (answers['q5'] as string[])?.length > 0 && !!answers['q6'] && (answers['q7'] as string[])?.length > 0 && !!answers['q8'];
    }
    if (step === 4) {
      return !!answers['q9'] && !!answers['q10'] && !!answers['q11'] && !!answers['q12'];
    }
    return true;
  };

  const onSubmitLead = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await submitNPIPlanLead({ leadData: data, answers });
      if (res.success && res.downloadBase64) {
        setDownloadUrl(`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.downloadBase64}`);
        setStep(6);
        scrollToTop();
      } else {
        alert(ui.saveFailed);
      }
    } catch (e) {
      alert(ui.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Helpers ---
  const renderQuestion = (q: QuestionDef) => {
    const ans = answers[q.id];
    const labelId = `npi-${q.id}`;

    return (
      <QuestionBlock
        key={q.id}
        id={labelId}
        index={q.id.replace('q', '')}
        text={q.question}
        hint={
          q.type === 'multiple' && q.maxSelections ? (
            <span aria-live="polite">{ui.choiceHint(q.maxSelections, Array.isArray(ans) ? ans.length : 0)}</span>
          ) : undefined
        }
      >
        {q.type === 'text' && (
          <textarea
            aria-labelledby={labelId}
            className="min-h-28 w-full rounded-xl border border-v3-line bg-v3-raise p-4 text-base leading-relaxed text-v3-bone transition-colors placeholder:text-v3-mute/70 focus:border-v3-light/60 focus:outline-none focus:ring-2 focus:ring-v3-light/70 rtl:leading-loose"
            placeholder={q.placeholder}
            rows={3}
            value={(ans as string) || ''}
            onChange={(e) => handleTextChange(q.id, e.target.value)}
          />
        )}

        {q.type === 'single' && q.options && (
          <ScaleOptions
            layout="list"
            label={q.question}
            options={q.options.map((opt) => ({ value: opt, label: opt }))}
            value={typeof ans === 'string' ? ans : undefined}
            onChange={(val) => handleSingleSelect(q.id, val)}
          />
        )}

        {q.type === 'multiple' && q.options && (
          <MultiOptions
            options={q.options}
            selected={Array.isArray(ans) ? ans : []}
            onToggle={(opt) => handleMultiSelect(q.id, opt, q.maxSelections)}
            labelledBy={labelId}
            max={q.maxSelections}
          />
        )}
      </QuestionBlock>
    );
  };

  // --- Step Components ---

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ToolIntro
            kicker={
              <span className="flex flex-wrap gap-2">
                {ui.pillarBadges.map((badge) => (
                  <span key={badge} className="rounded-full border border-v3-light/60 px-4 py-1.5">{badge}</span>
                ))}
              </span>
            }
            title={ui.introTitle}
            lead={ui.introLead}
            action={
              <div className="flex w-full flex-col items-start gap-10">
                <ul className="flex w-full flex-col border-y border-v3-line/70">
                  {ui.introRows.map((row) => (
                    <li key={row.mark} className="flex items-baseline gap-5 border-b border-v3-line/70 py-4 last:border-b-0">
                      <span aria-hidden className="w-5 shrink-0 font-v3-display text-2xl leading-none text-v3-light">{row.mark}</span>
                      <span className="leading-relaxed text-v3-soft rtl:leading-loose"><strong className="font-medium text-v3-bone">{row.name}</strong>{ui.introRowSeparator}{row.rest}</span>
                    </li>
                  ))}
                </ul>
                <ToolButton onClick={nextStep}>{ui.introButton}</ToolButton>
              </div>
            }
            meta={ui.introMeta}
          />
        );

      case 2:
      case 3:
      case 4: {
        const stepName = step === 2 ? 'narrative' : step === 3 ? 'presence' : 'impact';
        const questionsForStep = questions.filter(q => q.step === stepName);
        const copy = ui.steps[step - 2];

        return (
          <div className="flex flex-col pt-10">
            <p className="mb-3 text-sm text-v3-light">{copy.badge}</p>
            <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight md:text-4xl rtl:leading-snug">{copy.subtitle}</h2>
            <p className="text-v3-soft">{copy.desc}</p>

            <div className="flex flex-col">
              {questionsForStep.map(renderQuestion)}
            </div>
          </div>
        );
      }

      case 5:
        return (
          <div className="pt-10">
            <ToolPanel>
              <p className="mb-3 text-sm text-v3-light">{ui.leadKicker}</p>
              <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight rtl:leading-snug">
                {ui.leadTitle}
              </h2>
              <p className="mb-8 leading-relaxed text-v3-soft rtl:leading-loose">
                {ui.leadBody}
              </p>

              <form id="lead-form" onSubmit={handleSubmit(onSubmitLead)} className="flex flex-col gap-5">
                <ToolField
                  label={ui.nameLabel}
                  autoComplete="name"
                  placeholder={ui.namePlaceholder}
                  error={errors.name?.message}
                  {...register("name")}
                />

                <ToolField
                  label={ui.emailLabel}
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  placeholder={ui.emailPlaceholder}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <ToolField
                  label={<>{ui.roleLabel}<em className="font-normal text-v3-mute">{ui.roleOptional}</em></>}
                  autoComplete="organization-title"
                  placeholder={ui.rolePlaceholder}
                  {...register("role")}
                />

                <label
                  htmlFor="agreed"
                  className="mt-2 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-v3-line bg-v3-ink/40 p-4"
                >
                  <input
                    type="checkbox"
                    id="agreed"
                    {...register("agreed")}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                  />
                  <span className="text-sm leading-snug text-v3-soft rtl:leading-relaxed">
                    {ui.consent}
                  </span>
                </label>
              </form>
            </ToolPanel>
          </div>
        );

      case 6: {
        // Result Logic completely aligned with user's HTML payload
        const ans = (id: string): string => (answers[id] as string) || '';
        const ansArr = (id: string): string[] => (answers[id] as string[]) || [];

        // The name is collected by the lead form, not stored in `answers`.
        const leadName = (getValues('name') || '').trim();
        const firstName = leadName ? leadName.split(' ')[0] : ui.planFallbackName;
        const knownForList = ansArr('q3').slice(0, 2).join(ui.knownForJoiner);
        const knownForHtml = locale === 'en' ? knownForList.toLowerCase() : knownForList;
        const problem = locale === 'en' ? ans('q2').toLowerCase().replace(/^they /, '') : ans('q2');
        const brandStatement = ui.brandStatement(ans('q1'), problem, knownForHtml);

        const rhythm = ui.rhythmMap[ans('q6')] || ans('q6') || '';
        // The "which platform" challenge needs the visitor's first platform, so it
        // is built at render time rather than stored in the static map.
        const platformChallenge = getNpiQuestions(locale).find(q => q.id === 'q12')?.options?.[4] ?? '';
        const metrics = ui.metricsMap[ans('q9')] || ui.metricsFallback;

        type Action = NpiAction;
        const generateActions = () => {
          const acts: Action[] = [];

          const challenge = ui.challengeActions[ans('q12')];
          if (challenge) {
            acts.push(challenge);
          } else if (ans('q12') && ans('q12') === platformChallenge) {
            acts.push(ui.platformAction(ansArr('q5')[0] || ui.defaultPlatform));
          }

          const goal = ui.goalActions[ans('q9')];
          if (goal) acts.push(goal);

          const consistency = ui.consistencyActions[ans('q8')];
          if (consistency) acts.push(consistency);

          if (acts.length < 3) acts.push(ui.fallbackAction);
          return acts.slice(0, 3);
        };
        const actions = generateActions();

        return (
          <div className="flex w-full flex-col gap-6 py-8 md:py-12">
            <div className="flex flex-col gap-3 border-b border-v3-line pb-10 text-center">
              <p className="text-sm text-v3-light">{ui.planKicker}</p>
              <h1 className="font-v3-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] rtl:leading-[1.4]">{ui.planHeading(firstName)}</h1>
              <p className="text-sm text-v3-mute">{ui.planBuiltWith}{new Date().toLocaleDateString(ui.dateLocale, {year:'numeric',month:'long',day:'numeric'})}</p>
            </div>

            {/* Narrative */}
            <Pillar heading={ui.narrativeHeading}>
              <blockquote className="mb-4 border-s-2 border-v3-light ps-5 font-v3-display text-xl font-light italic leading-relaxed text-v3-bone rtl:not-italic rtl:leading-loose">
                {brandStatement}
              </blockquote>
              <dl>
                <Row label={ui.rowAudience}>{ans('q1')}</Row>
                <Row label={ui.rowKnownFor}><Tags items={ansArr('q3')} /></Row>
                <Row label={ui.rowThemes}><Tags items={ansArr('q4')} /></Row>
              </dl>
            </Pillar>

            {/* Presence */}
            <Pillar heading={ui.presenceHeading}>
              <dl>
                <Row label={ui.rowPlatforms}><Tags items={ansArr('q5')} /></Row>
                <Row label={ui.rowFrequency}>{ans('q6')}</Row>
                <Row label={ui.rowFormats}><Tags items={ansArr('q7')} /></Row>
                <Row label={ui.rowRhythm}>{rhythm}</Row>
              </dl>
            </Pillar>

            {/* Impact */}
            <Pillar heading={ui.impactHeading}>
              <dl>
                <Row label={ui.rowGoal}>{ans('q9')}</Row>
                <Row label={ui.rowTarget}>{ans('q10')}</Row>
                <Row label={ui.rowMetrics}><Tags items={metrics} /></Row>
              </dl>
            </Pillar>

            {/* Actions */}
            <Pillar heading={ui.actionsHeading}>
              <ol className="flex flex-col">
                {actions.map((ac, i) => (
                  <li key={i} className="flex items-start gap-5 border-b border-v3-line/60 py-4 last:border-b-0">
                    <span className="w-5 shrink-0 font-v3-display text-2xl leading-none text-v3-light">{i + 1}</span>
                    <p className="leading-relaxed text-v3-soft rtl:leading-loose">
                      <strong className="mb-1 block font-medium text-v3-bone">{ac.title}</strong>
                      {ac.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </Pillar>

            {/* Download Output */}
            <ToolPanel className="mt-4 text-center">
              <h3 className="mb-3 font-v3-display text-2xl font-light">{ui.downloadHeading}</h3>
              <p className="mx-auto mb-6 max-w-xl leading-relaxed text-v3-soft rtl:leading-loose">{ui.downloadBody}</p>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`NPI_Operating_System.xlsx`}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-raise"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {ui.downloadButton}
                </a>
              )}
            </ToolPanel>

            <div className="mt-4 border-t border-v3-line pt-6 text-center text-sm leading-relaxed text-v3-mute">
              {ui.footerLead}<strong className="font-medium text-v3-soft">{ui.footerName}</strong>{ui.footerRole}<br/>
              <a href="https://farjadp.info" target="_blank" rel="noopener" className="font-medium text-v3-light underline-offset-4 hover:underline" dir="ltr">farjadp.info</a>{ui.footerCta}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex flex-col">
      {step > 1 && step < 6 && (
        <ToolProgress
          label={
            <ol className="flex flex-wrap gap-x-4 gap-y-1">
              {ui.progressLabels.map((l, i) => (
                <li
                  key={l}
                  aria-current={i + 1 === step ? 'step' : undefined}
                  className={i + 1 === step ? 'text-v3-light' : i + 1 < step ? 'text-v3-soft' : ''}
                >
                  {l}
                </li>
              ))}
            </ol>
          }
          percent={(step / 5) * 100}
        />
      )}

      <StepIn key={step}>
        {renderStepContent()}
      </StepIn>

      {/* Navigation Buttons */}
      {step > 1 && step < 6 && (
        <div className="flex items-center gap-3 pt-10">
          <ToolButton variant="quiet" onClick={prevStep}>
            {ui.back}
          </ToolButton>

          {step < 5 ? (
            <ToolButton className="flex-1" onClick={nextStep} disabled={!isStepValid()}>
              {step === 4 ? ui.almostDone : ui.next}
            </ToolButton>
          ) : (
            <ToolButton className="flex-1" onClick={handleSubmit(onSubmitLead)} loading={isSubmitting}>
              {isSubmitting ? ui.submitCtaLoading : ui.submitCta}
            </ToolButton>
          )}
        </div>
      )}
    </div>
  );
}
