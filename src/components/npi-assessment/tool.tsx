"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { npiQuestions, QuestionDef } from '@/lib/npi/data';
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

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().optional(),
  agreed: z.boolean(),
});
type LeadFormValues = z.infer<typeof leadSchema>;

const PROGRESS_LABELS = ['Intro', 'Narrative', 'Presence', 'Impact', 'Plan'];

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

export function NPIAssessmentTool() {
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
        alert("Failed to save. Please try again.");
      }
    } catch (e) {
      alert("Error submitting. Please check your connection.");
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
            <span aria-live="polite">(Choose up to {q.maxSelections}. Selected: {Array.isArray(ans) ? ans.length : 0}/{q.maxSelections})</span>
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
                <span className="rounded-full border border-v3-light/60 px-4 py-1.5">N · Narrative</span>
                <span className="rounded-full border border-v3-light/60 px-4 py-1.5">P · Presence</span>
                <span className="rounded-full border border-v3-light/60 px-4 py-1.5">I · Impact</span>
              </span>
            }
            title="Build Your Personal Brand Plan in 5 Minutes"
            lead="Answer 12 questions. Get a free personalized NPI plan — your narrative, your presence system, and your impact targets — in an Excel file you can use starting today."
            action={
              <div className="flex w-full flex-col items-start gap-10">
                <ul className="flex w-full flex-col border-y border-v3-line/70">
                  {[
                    { mark: 'N', name: 'Narrative', rest: 'your brand statement, audience, and core themes' },
                    { mark: 'P', name: 'Presence', rest: 'your weekly visibility system based on your reality' },
                    { mark: 'I', name: 'Impact', rest: 'the metrics that actually matter for your goal' },
                  ].map((row) => (
                    <li key={row.mark} className="flex items-baseline gap-5 border-b border-v3-line/70 py-4 last:border-b-0">
                      <span aria-hidden className="w-5 shrink-0 font-v3-display text-2xl leading-none text-v3-light">{row.mark}</span>
                      <span className="leading-relaxed text-v3-soft rtl:leading-loose"><strong className="font-medium text-v3-bone">{row.name}</strong> — {row.rest}</span>
                    </li>
                  ))}
                </ul>
                <ToolButton onClick={nextStep}>Start Building My Plan →</ToolButton>
              </div>
            }
            meta="Used by consultants, founders, and professionals in Canada"
          />
        );

      case 2:
      case 3:
      case 4: {
        const stepName = step === 2 ? 'narrative' : step === 3 ? 'presence' : 'impact';
        const questionsForStep = npiQuestions.filter(q => q.step === stepName);

        let badgeLabel = 'N · Narrative';
        let subtitle = 'Define what you stand for';
        let desc = 'These 4 questions build your brand statement and core themes.';

        if (step === 3) {
          badgeLabel = 'P · Presence';
          subtitle = 'How you show up consistently';
          desc = 'These answers build your personal presence system.';
        } else if (step === 4) {
          badgeLabel = 'I · Impact';
          subtitle = 'Define the results that matter';
          desc = 'These answers determine what you should measure — and what success actually looks like.';
        }

        return (
          <div className="flex flex-col pt-10">
            <p className="mb-3 text-sm text-v3-light">{badgeLabel}</p>
            <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight md:text-4xl rtl:leading-snug">{subtitle}</h2>
            <p className="text-v3-soft">{desc}</p>

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
              <p className="mb-3 text-sm text-v3-light">Get Your Plan</p>
              <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight rtl:leading-snug">
                Your personalized NPI plan is ready.
              </h2>
              <p className="mb-8 leading-relaxed text-v3-soft rtl:leading-loose">
                Enter your name and email to access your free Excel plan. You will also receive a copy by email.
              </p>

              <form id="lead-form" onSubmit={handleSubmit(onSubmitLead)} className="flex flex-col gap-5">
                <ToolField
                  label="Full Name *"
                  autoComplete="name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <ToolField
                  label="Email Address *"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <ToolField
                  label={<>Your Current Role <em className="font-normal text-v3-mute">(optional)</em></>}
                  autoComplete="organization-title"
                  placeholder="e.g. Founder, Consultant"
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
                    I agree to receive occasional insights and updates from Farjad Pourmohammad. No spam. Unsubscribe anytime.
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
        const firstName = leadName ? leadName.split(' ')[0] : 'Your';
        const knownForHtml = (ansArr('q3').slice(0,2) || []).join(' and ').toLowerCase();
        const brandStatement = `"I help ${ans('q1') || '...'} ${ans('q2').toLowerCase().replace(/^they /, '')} through ${knownForHtml}."`;

        const rhythmMap: Record<string, string> = {
          'Every day': 'Post daily: rotate short post → story → insight → engagement → repeat.',
          '3–4 times per week (recommended)': 'Week structure: 2 short posts + 1 long-form + 5 meaningful comments.',
          '1–2 times per week': '1 strong post per week + 3–5 thoughtful comments on relevant content.',
          'A few times per month': '2 posts per month minimum + consistent engagement in your community.'
        };
        const rhythm = rhythmMap[ans('q6')] || ans('q6') || '';

        const metricsMap: Record<string, string[]> = {
          'Get more consulting or freelance clients': ['Qualified inbound DMs / week', 'Discovery calls booked / month', 'Referrals received / month'],
          'Attract investors or partnerships': ['Investor intro conversations / month', 'Partnership meetings / month', 'Warm introductions through content'],
          'Get speaking invitations': ['Speaking invitations / month', 'Event applications submitted', 'Podcast / guest appearances'],
          'Build a community or audience': ['Newsletter subscribers (qualified)', 'Engaged comments per post', 'Community members who DM you'],
          'Find a better job or career opportunity': ['Recruiter / hiring manager outreach', 'Profile views increase', 'Job referrals from network'],
          'Launch and sell a product or service': ['Content-to-purchase conversions', 'Waitlist signups', 'DMs about your offer'],
          'Become a recognized thought leader': ['Media mentions / month', 'Invitation to contribute / publish', 'Peer recognition signals']
        };
        const metrics = metricsMap[ans('q9')] || ['Inbound opportunities / month', 'Content engagement quality', 'Network growth (qualified)'];

        type Action = { title: string; desc: string };
        const generateActions = () => {
          const acts: Action[] = [];

          const challenges: Record<string, Action> = {
            'I do not know what to say or stand for': { title: 'Use your brand statement as your LinkedIn headline.', desc: " The statement in your plan above — put it on your profile today. Not tomorrow. Today." },
            'I do not show up consistently enough': { title: 'Commit to one post this week — just one.', desc: " Forget streaks and consistency goals for now. Publish one strong thing. Build the habit from there." },
            'I get attention but no real results': { title: 'Add a clear call to action to your next 3 posts.', desc: " End each post with one sentence that invites a specific response: a DM, a comment, a booking." },
            'I do not have time': { title: 'Block 45 minutes every Sunday for your NPI review.', desc: " That is all you need. Plan the week's content in 20 minutes. Update your tracker in 15. Reflect in 10." },
            'I do not know which platform to focus on': { title: 'Pick one platform and commit to it for 60 days.', desc: ` Based on your answers, start with ${(ansArr('q5')[0] || 'LinkedIn')}. Master one before adding another.` },
            'I am starting from zero': { title: 'Start by documenting, not creating.', desc: " Share what you are learning and doing. You do not need expertise to start — you need honesty." }
          };
          if (challenges[ans('q12')]) acts.push(challenges[ans('q12')]);

          const goals: Record<string, Action> = {
            'Get more consulting or freelance clients': { title: 'Reach out to 3 warm contacts this week.', desc: " No pitch. Just a genuine check-in or share something relevant to them. Relationship before transaction." },
            'Attract investors or partnerships': { title: 'Write one post about a real problem you are solving.', desc: " Not your solution — the problem. Investors and partners lean in when they recognize the pain." },
            'Get speaking invitations': { title: 'Comment thoughtfully on 5 event organizer or host posts this week.', desc: " Be visible in the right spaces before you ask to be on stage." },
            'Build a community or audience': { title: 'Reply to every comment you get for the next 30 days.', desc: " Community is built in the replies, not in the posts." },
          };
          if (goals[ans('q9')]) acts.push(goals[ans('q9')]);

          const consistencies: Record<string, Action> = {
            'Very consistent — I posted regularly': { title: 'Your next step is quality over quantity.', desc: " You show up — good. Now ask: does each piece of content tie directly to one of your 5 themes?" },
            'Inconsistent — I started and stopped': { title: 'Lower the bar to make consistency possible.', desc: " A system you keep for 9 months beats a sprint that lasts 9 days. Cut your target in half if needed." },
            'Not active — I am starting now': { title: 'Publish your first post this week.', desc: " Share your brand statement from this plan as a LinkedIn post. Say who you help and why it matters. That is post one." },
          };
          if (consistencies[ans('q8')]) acts.push(consistencies[ans('q8')]);

          if (acts.length < 3) {
            acts.push({ title: 'Open your NPI Excel plan and fill in your Pipeline sheet.', desc: " List every warm contact you have. Then identify the top 3 people."});
          }
          return acts.slice(0, 3);
        };
        const actions = generateActions();

        return (
          <div className="flex w-full flex-col gap-6 py-8 md:py-12">
            <div className="flex flex-col gap-3 border-b border-v3-line pb-10 text-center">
              <p className="text-sm text-v3-light">Your NPI Plan</p>
              <h1 className="font-v3-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] rtl:leading-[1.4]">{firstName}&apos;s Personal Brand Plan</h1>
              <p className="text-sm text-v3-mute">Built with the NPI Framework · {new Date().toLocaleDateString('en-CA', {year:'numeric',month:'long',day:'numeric'})}</p>
            </div>

            {/* Narrative */}
            <Pillar heading="N · NARRATIVE — What you stand for">
              <blockquote className="mb-4 border-s-2 border-v3-light ps-5 font-v3-display text-xl font-light italic leading-relaxed text-v3-bone rtl:not-italic rtl:leading-loose">
                {brandStatement}
              </blockquote>
              <dl>
                <Row label="Target Audience">{ans('q1')}</Row>
                <Row label="Known For"><Tags items={ansArr('q3')} /></Row>
                <Row label="Core Themes"><Tags items={ansArr('q4')} /></Row>
              </dl>
            </Pillar>

            {/* Presence */}
            <Pillar heading="P · PRESENCE — How you show up">
              <dl>
                <Row label="Main Platforms"><Tags items={ansArr('q5')} /></Row>
                <Row label="Frequency">{ans('q6')}</Row>
                <Row label="Formats"><Tags items={ansArr('q7')} /></Row>
                <Row label="Weekly Rhythm">{rhythm}</Row>
              </dl>
            </Pillar>

            {/* Impact */}
            <Pillar heading="I · IMPACT — What you measure">
              <dl>
                <Row label="Primary Goal">{ans('q9')}</Row>
                <Row label="90-Day Target">{ans('q10')}</Row>
                <Row label="Key Metrics"><Tags items={metrics} /></Row>
              </dl>
            </Pillar>

            {/* Actions */}
            <Pillar heading="⚡ YOUR NEXT 3 ACTIONS — Start this week">
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
              <h3 className="mb-3 font-v3-display text-2xl font-light">📥 Download Your Personalized NPI Excel Plan</h3>
              <p className="mx-auto mb-6 max-w-xl leading-relaxed text-v3-soft rtl:leading-loose">Get your complete NPI operating system — Narrative, Weekly Tracker, Impact Log, and Pipeline — pre-filled with your answers.</p>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`NPI_Operating_System.xlsx`}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-raise"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download My NPI Plan (.xlsx)
                </a>
              )}
            </ToolPanel>

            <div className="mt-4 border-t border-v3-line pt-6 text-center text-sm leading-relaxed text-v3-mute">
              Built on the NPI Framework by <strong className="font-medium text-v3-soft">Farjad Pourmohammad</strong> — Business Consultant, Toronto<br/>
              <a href="https://farjadp.info" target="_blank" rel="noopener" className="font-medium text-v3-light underline-offset-4 hover:underline">farjadp.info</a> · Book a free strategy session
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
              {PROGRESS_LABELS.map((l, i) => (
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
            ← Back
          </ToolButton>

          {step < 5 ? (
            <ToolButton className="flex-1" onClick={nextStep} disabled={!isStepValid()}>
              {step === 4 ? 'Almost Done →' : 'Next →'}
            </ToolButton>
          ) : (
            <ToolButton className="flex-1" onClick={handleSubmit(onSubmitLead)} loading={isSubmitting}>
              {isSubmitting ? 'Building your plan...' : 'Get My Free NPI Plan →'}
            </ToolButton>
          )}
        </div>
      )}
    </div>
  );
}
