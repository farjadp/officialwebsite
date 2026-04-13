"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { npiQuestions, QuestionDef } from '@/lib/npi/data';
import { submitNPIPlanLead } from '@/actions/npi-assessment';
import { ArrowRight, ArrowLeft, Loader2, Download, CheckCircle2 } from 'lucide-react';

// --- Theme Tokens (Merged with user HTML colors) ---
const theme = {
  bg: '#F4F6F9',
  primary: '#1F3F6E',
  navy: '#0D1B2A',
  accent: '#2962B8',
  highlight: '#C0392B',
  text: '#0D1B2A',
  cardBg: '#FFFFFF',
  textMid: '#3A4A5C',
  textLight: '#7A8A9C',
  nBg: '#1A3A5C', nSoft: '#D6E8F7',
  pBg: '#145233', pSoft: '#D5F0E3',
  iBg: '#4A1A6E', iSoft: '#EBD9FF',
};

// --- Schema ---
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().optional(),
  agreed: z.boolean(),
});
type LeadFormValues = z.infer<typeof leadSchema>;

export function NPIAssessmentTool() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { agreed: true }
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 6) as Step);
  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

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

    return (
      <div key={q.id} className="mb-8 relative">
        <label className="flex items-center gap-2 text-[15px] font-bold mb-3 text-[#0D1B2A] leading-tight">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2962B8] text-white text-[11px] flex-shrink-0">
            {q.id.replace('q', '')}
          </span>
          {q.question}
        </label>
        
        <div className="pl-8">
          {(q.type === 'multiple' && q.maxSelections) && (
            <p className="text-xs text-[#7A8A9C] mb-3 -mt-2">
              (Choose up to {q.maxSelections}. Selected: {Array.isArray(ans) ? ans.length : 0}/{q.maxSelections})
            </p>
          )}

          {q.type === 'text' && (
            <textarea
              className="w-full p-4 border-2 border-[#C5CBD8] rounded-lg text-[14px] text-[#0D1B2A] transition-colors focus:outline-none focus:border-[#2962B8]"
              placeholder={q.placeholder}
              rows={3}
              value={(ans as string) || ''}
              onChange={(e) => handleTextChange(q.id, e.target.value)}
            />
          )}

          {(q.type === 'single' || q.type === 'multiple') && q.options && (
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const isMulti = q.type === 'multiple';
                const selectedArray = (ans as string[]) || [];
                const isSelected = isMulti ? selectedArray.includes(opt) : ans === opt;
                
                let activeBorder = '#2962B8';
                let activeText = '#2962B8';
                let activeBg = '#D6E8F7';

                if (q.step === 'presence') { activeBorder = '#145233'; activeText = '#145233'; activeBg = '#D5F0E3'; }
                if (q.step === 'impact') { activeBorder = '#4A1A6E'; activeText = '#4A1A6E'; activeBg = '#EBD9FF'; }

                return (
                  <div
                    key={opt}
                    onClick={() => isMulti ? handleMultiSelect(q.id, opt, q.maxSelections) : handleSingleSelect(q.id, opt)}
                    className="px-4 py-2 border-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all select-none hover:shadow-sm hover:opacity-80"
                    style={{
                      borderColor: isSelected ? activeBorder : '#C5CBD8',
                      backgroundColor: isSelected ? activeBg : '#FFFFFF',
                      color: isSelected ? activeText : '#3A4A5C'
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Step Components ---

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center py-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <span className="px-5 py-2 rounded-full text-[13px] font-extrabold tracking-widest uppercase bg-[#D6E8F7] text-[#1A3A5C]">N · Narrative</span>
              <span className="px-5 py-2 rounded-full text-[13px] font-extrabold tracking-widest uppercase bg-[#D5F0E3] text-[#145233]">P · Presence</span>
              <span className="px-5 py-2 rounded-full text-[13px] font-extrabold tracking-widest uppercase bg-[#EBD9FF] text-[#4A1A6E]">I · Impact</span>
            </div>
            <h1 className="text-3xl md:text-[30px] leading-tight font-extrabold mb-4 text-[#0D1B2A]">
              Build Your Personal Brand Plan in 5 Minutes
            </h1>
            <p className="text-[16px] mb-8 mx-auto max-w-[520px] text-[#3A4A5C] leading-relaxed">
              Answer 12 questions. Get a free personalized NPI plan — your narrative, your presence system, and your impact targets — in an Excel file you can use starting today.
            </p>
            
            <div className="flex flex-col gap-3 max-w-[460px] mx-auto text-left mb-8">
              <div className="flex items-center gap-3 text-[14px] text-[#3A4A5C]">
                <div className="w-7 h-7 rounded-full bg-[#D6E8F7] flex items-center justify-center flex-shrink-0 text-[13px]">🧭</div>
                <span><strong>Narrative</strong> — your brand statement, audience, and core themes</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-[#3A4A5C]">
                <div className="w-7 h-7 rounded-full bg-[#D5F0E3] flex items-center justify-center flex-shrink-0 text-[13px]">📅</div>
                <span><strong>Presence</strong> — your weekly visibility system based on your reality</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-[#3A4A5C]">
                <div className="w-7 h-7 rounded-full bg-[#EBD9FF] flex items-center justify-center flex-shrink-0 text-[13px]">🎯</div>
                <span><strong>Impact</strong> — the metrics that actually matter for your goal</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="px-7 py-3.5 rounded-lg font-bold text-[14px] text-white transition-transform hover:-translate-y-0.5 flex items-center justify-center mx-auto gap-2 bg-[#C0392B]"
            >
              Start Building My Plan →
            </button>
            <p className="mt-4 text-[12px] text-[#7A8A9C]">Used by consultants, founders, and professionals in Canada</p>
          </div>
        );
      
      case 2:
      case 3:
      case 4:
        const stepName = step === 2 ? 'narrative' : step === 3 ? 'presence' : 'impact';
        const questionsForStep = npiQuestions.filter(q => q.step === stepName);
        
        let badgeClass = 'bg-[#1A3A5C] text-[#D6E8F7]';
        let badgeLabel = 'N · Narrative';
        let subtitle = 'Define what you stand for';
        let desc = 'These 4 questions build your brand statement and core themes.';
        
        if (step === 3) {
          badgeClass = 'bg-[#D5F0E3] text-[#145233]';
          badgeLabel = 'P · Presence';
          subtitle = 'How you show up consistently';
          desc = 'These answers build your personal presence system.';
        } else if (step === 4) {
          badgeClass = 'bg-[#EBD9FF] text-[#4A1A6E]';
          badgeLabel = 'I · Impact';
          subtitle = 'Define the results that matter';
          desc = 'These answers determine what you should measure — and what success actually looks like.';
        }

        return (
          <div className="text-left">
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 ${badgeClass}`}>
              {badgeLabel}
            </span>
            <h2 className="text-[20px] font-bold mb-2 text-[#0D1B2A]">{subtitle}</h2>
            <p className="text-[13px] text-[#7A8A9C] mb-8">{desc}</p>
            
            <div className="space-y-2">
              {questionsForStep.map(renderQuestion)}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-left py-2">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 bg-[#FDEBD0] text-[#7B2A00]">
              Get Your Plan
            </span>
            <h2 className="text-[20px] font-bold mb-4 text-[#0D1B2A]">
              Your personalized NPI plan is ready.
            </h2>
            <p className="text-[#3A4A5C] text-[15px] mb-6">
              Enter your name and email to access your free Excel plan. You will also receive a copy by email.
            </p>

            <form id="lead-form" onSubmit={handleSubmit(onSubmitLead)} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold mb-2 text-[#0D1B2A]">Full Name *</label>
                <input {...register("name")} className="w-full p-3 border-2 border-[#C5CBD8] rounded-lg outline-none focus:border-[#2962B8] text-[14px]" placeholder="Your full name" />
                {errors.name && <p className="text-[#C0392B] text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-bold mb-2 text-[#0D1B2A]">Email Address *</label>
                <input type="email" {...register("email")} className="w-full p-3 border-2 border-[#C5CBD8] rounded-lg outline-none focus:border-[#2962B8] text-[14px]" placeholder="your@email.com" />
                {errors.email && <p className="text-[#C0392B] text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-bold mb-2 text-[#0D1B2A]">Your Current Role <em className="font-normal text-[#7A8A9C]">(optional)</em></label>
                <input {...register("role")} className="w-full p-3 border-2 border-[#C5CBD8] rounded-lg outline-none focus:border-[#2962B8] text-[14px]" placeholder="e.g. Founder, Consultant" />
              </div>

              <div className="flex items-start gap-3 mt-4 p-3.5 bg-[#F4F6F9] rounded-lg">
                <input type="checkbox" id="agreed" {...register("agreed")} className="mt-0.5 w-4 h-4" />
                <label htmlFor="agreed" className="text-[12px] text-[#3A4A5C] leading-snug cursor-pointer">
                  I agree to receive occasional insights and updates from Farjad Pourmohammad. No spam. Unsubscribe anytime.
                </label>
              </div>
            </form>
          </div>
        );

      case 6:
        // Result Logic completely aligned with user's HTML payload
        const ans = (id: string): string => (answers[id] as string) || '';
        const ansArr = (id: string): string[] => (answers[id] as string[]) || [];

        const firstName = answers.name ? (answers.name as string).split(' ')[0] : 'Your';
        const knownForHtml = (ansArr('q3').slice(0,2) || []).join(' and ').toLowerCase();
        const brandStatement = `"I help ${ans('q1') || '...'} ${ans('q2').toLowerCase().replace(/^they /, '')} through ${knownForHtml}."`;
        
        const rhythmMap: any = {
          'Every day': 'Post daily: rotate short post → story → insight → engagement → repeat.',
          '3–4 times per week (recommended)': 'Week structure: 2 short posts + 1 long-form + 5 meaningful comments.',
          '1–2 times per week': '1 strong post per week + 3–5 thoughtful comments on relevant content.',
          'A few times per month': '2 posts per month minimum + consistent engagement in your community.'
        };
        const rhythm = rhythmMap[ans('q6')] || ans('q6') || '';

        const metricsMap: any = {
          'Get more consulting or freelance clients': ['Qualified inbound DMs / week', 'Discovery calls booked / month', 'Referrals received / month'],
          'Attract investors or partnerships': ['Investor intro conversations / month', 'Partnership meetings / month', 'Warm introductions through content'],
          'Get speaking invitations': ['Speaking invitations / month', 'Event applications submitted', 'Podcast / guest appearances'],
          'Build a community or audience': ['Newsletter subscribers (qualified)', 'Engaged comments per post', 'Community members who DM you'],
          'Find a better job or career opportunity': ['Recruiter / hiring manager outreach', 'Profile views increase', 'Job referrals from network'],
          'Launch and sell a product or service': ['Content-to-purchase conversions', 'Waitlist signups', 'DMs about your offer'],
          'Become a recognized thought leader': ['Media mentions / month', 'Invitation to contribute / publish', 'Peer recognition signals']
        };
        const metrics = metricsMap[ans('q9')] || ['Inbound opportunities / month', 'Content engagement quality', 'Network growth (qualified)'];

        const generateActions = () => {
          const acts = [];
          
          const challenges: any = {
            'I do not know what to say or stand for': { title: 'Use your brand statement as your LinkedIn headline.', desc: " The statement in your plan above — put it on your profile today. Not tomorrow. Today." },
            'I do not show up consistently enough': { title: 'Commit to one post this week — just one.', desc: " Forget streaks and consistency goals for now. Publish one strong thing. Build the habit from there." },
            'I get attention but no real results': { title: 'Add a clear call to action to your next 3 posts.', desc: " End each post with one sentence that invites a specific response: a DM, a comment, a booking." },
            'I do not have time': { title: 'Block 45 minutes every Sunday for your NPI review.', desc: " That is all you need. Plan the week's content in 20 minutes. Update your tracker in 15. Reflect in 10." },
            'I do not know which platform to focus on': { title: 'Pick one platform and commit to it for 60 days.', desc: ` Based on your answers, start with ${(ansArr('q5')[0] || 'LinkedIn')}. Master one before adding another.` },
            'I am starting from zero': { title: 'Start by documenting, not creating.', desc: " Share what you are learning and doing. You do not need expertise to start — you need honesty." }
          };
          if (challenges[ans('q12')]) acts.push(challenges[ans('q12')]);

          const goals: any = {
            'Get more consulting or freelance clients': { title: 'Reach out to 3 warm contacts this week.', desc: " No pitch. Just a genuine check-in or share something relevant to them. Relationship before transaction." },
            'Attract investors or partnerships': { title: 'Write one post about a real problem you are solving.', desc: " Not your solution — the problem. Investors and partners lean in when they recognize the pain." },
            'Get speaking invitations': { title: 'Comment thoughtfully on 5 event organizer or host posts this week.', desc: " Be visible in the right spaces before you ask to be on stage." },
            'Build a community or audience': { title: 'Reply to every comment you get for the next 30 days.', desc: " Community is built in the replies, not in the posts." },
          };
          if (goals[ans('q9')]) acts.push(goals[ans('q9')]);

          const consistencies: any = {
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

        const tagMap = (arr: string[], color: string) => arr.map(t => <span key={t} className={`px-2.5 py-1 rounded-full text-[12px] font-semibold m-0.5 inline-block ${color}`}>{t}</span>);

        return (
          <div className="w-full">
            <div className="text-center pb-6 border-b-2 border-[#E8ECF2] mb-7">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 bg-[#E8ECF2] text-[#1F3F6E]">Your NPI Plan</div>
              <h1 className="text-[24px] font-extrabold text-[#0D1B2A] mb-2">{firstName}'s Personal Brand Plan</h1>
              <p className="text-[14px] text-[#7A8A9C]">Built with the NPI Framework · {new Date().toLocaleDateString('en-CA', {year:'numeric',month:'long',day:'numeric'})}</p>
            </div>

            {/* Narrative Box */}
            <div className="mb-6">
              <div className="bg-[#1A3A5C] text-white text-[11px] font-extrabold tracking-widest uppercase px-3.5 py-2 rounded-t-md">N · NARRATIVE — What you stand for</div>
              <div className="border border-t-0 border-[#C5CBD8] rounded-b-lg p-5 bg-white">
                <div className="bg-[#D6E8F7] border-l-4 border-[#1A3A5C] p-4 rounded-r-lg text-[15px] font-bold text-[#1A3A5C] italic leading-relaxed mb-4">
                  {brandStatement}
                </div>
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Target Audience</div><div className="text-[14px] text-[#0D1B2A]">{ans('q1')}</div></div>
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Known For</div><div className="flex flex-wrap">{tagMap(ansArr('q3'), 'bg-[#D6E8F7] text-[#1A3A5C]')}</div></div>
                <div className="flex gap-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Core Themes</div><div className="flex flex-wrap">{tagMap(ansArr('q4'), 'bg-[#D6E8F7] text-[#1A3A5C]')}</div></div>
              </div>
            </div>

            {/* Presence Box */}
            <div className="mb-6">
              <div className="bg-[#145233] text-white text-[11px] font-extrabold tracking-widest uppercase px-3.5 py-2 rounded-t-md">P · PRESENCE — How you show up</div>
              <div className="border border-t-0 border-[#C5CBD8] rounded-b-lg p-5 bg-white">
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Main Platforms</div><div className="flex flex-wrap">{tagMap(ansArr('q5'), 'bg-[#D5F0E3] text-[#145233]')}</div></div>
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Frequency</div><div className="text-[14px] text-[#0D1B2A]">{ans('q6')}</div></div>
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Formats</div><div className="flex flex-wrap">{tagMap(ansArr('q7'), 'bg-[#D5F0E3] text-[#145233]')}</div></div>
                <div className="flex gap-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Weekly Rhythm</div><div className="text-[14px] text-[#0D1B2A]">{rhythm}</div></div>
              </div>
            </div>

            {/* Impact Box */}
            <div className="mb-6">
              <div className="bg-[#4A1A6E] text-white text-[11px] font-extrabold tracking-widest uppercase px-3.5 py-2 rounded-t-md">I · IMPACT — What you measure</div>
              <div className="border border-t-0 border-[#C5CBD8] rounded-b-lg p-5 bg-white">
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Primary Goal</div><div className="text-[14px] text-[#0D1B2A]">{ans('q9')}</div></div>
                <div className="flex gap-3 mb-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">90-Day Target</div><div className="text-[14px] text-[#0D1B2A]">{ans('q10')}</div></div>
                <div className="flex gap-3"><div className="text-[12px] font-bold text-[#7A8A9C] w-32 shrink-0 uppercase tracking-wide">Key Metrics</div><div className="flex flex-wrap">{tagMap(metrics, 'bg-[#EBD9FF] text-[#4A1A6E]')}</div></div>
              </div>
            </div>

            {/* Actions Box */}
            <div className="mb-8">
              <div className="bg-[#0D1B2A] text-white text-[11px] font-extrabold tracking-widest uppercase px-3.5 py-2 rounded-t-md">⚡ YOUR NEXT 3 ACTIONS — Start this week</div>
              <div className="border border-t-0 border-[#C5CBD8] rounded-b-lg p-5 bg-white">
                {actions.map((ac, i) => (
                  <div key={i} className="flex gap-3 items-start py-3 border-b border-[#E8ECF2] last:border-0 last:pb-0">
                    <div className="w-7 h-7 rounded-full bg-[#C0392B] text-white text-[13px] font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                    <div className="text-[14px] text-[#0D1B2A] leading-relaxed">
                      <strong className="block text-[#0D1B2A] mb-0.5">{ac.title}</strong>
                      {ac.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Output */}
            <div className="mt-7 p-6 bg-[#F4F6F9] rounded-xl text-center border-2 border-dashed border-[#C5CBD8]">
              <h3 className="text-[16px] font-extrabold text-[#0D1B2A] mb-2">📥 Download Your Personalized NPI Excel Plan</h3>
              <p className="text-[13px] text-[#3A4A5C] mb-4">Get your complete NPI operating system — Narrative, Weekly Tracker, Impact Log, and Pipeline — pre-filled with your answers.</p>
              
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`NPI_Operating_System.xlsx`}
                  className="block w-full py-4 rounded-lg font-bold text-[15px] text-white transition-colors bg-[#1F3F6E] hover:bg-[#0D1B2A]"
                >
                  Download My NPI Plan (.xlsx)
                </a>
              )}
            </div>

            <div className="text-center mt-7 pt-5 border-t border-[#C5CBD8] text-[13px] text-[#7A8A9C] leading-relaxed">
              Built on the NPI Framework by <strong>Farjad Pourmohammad</strong> — Business Consultant, Toronto<br/>
              <a href="https://farjadp.info" target="_blank" rel="noopener" className="text-[#2962B8] font-semibold hover:underline">farjadp.info</a> · Book a free strategy session
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-10" style={{ backgroundColor: theme.bg }}>

      {/* Embedded top progress bar style matching user request */}
      {step > 1 && step < 6 && (
        <div className="w-full bg-white border-b border-[#C5CBD8] sticky top-0 z-50 mb-8 p-3 shadow-sm max-w-3xl mx-auto rounded-xl">
           <div className="flex justify-between max-w-[680px] mx-auto text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#7A8A9C] mb-2">
             <span className={step >= 1 ? 'text-[#145233]' : ''}>Intro</span>
             <span className={step >= 2 ? (step === 2 ? 'text-[#2962B8]' : 'text-[#145233]') : ''}>Narrative</span>
             <span className={step >= 3 ? (step === 3 ? 'text-[#2962B8]' : 'text-[#145233]') : ''}>Presence</span>
             <span className={step >= 4 ? (step === 4 ? 'text-[#2962B8]' : 'text-[#145233]') : ''}>Impact</span>
             <span className={step >= 5 ? (step === 5 ? 'text-[#2962B8]' : 'text-[#145233]') : ''}>Plan</span>
           </div>
           <div className="max-w-[680px] mx-auto bg-[#E8ECF2] h-1.5 rounded-full overflow-hidden">
             <div 
               className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#2962B8] to-[#C0392B]"
               style={{ width: `${(step / 5) * 100}%` }}
             />
           </div>
        </div>
      )}

      <div className="w-full max-w-[720px] bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-10 mx-auto transition-all">
        {/* Content Wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step > 1 && step < 6 && (
          <div className="flex items-center gap-3 mt-8 pt-6">
            <button
              onClick={prevStep}
              className="px-6 py-3.5 rounded-lg font-bold text-[#3A4A5C] bg-[#E8ECF2] hover:bg-[#C5CBD8] transition-colors text-[14px]"
            >
              ← Back
            </button>

            {step < 5 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex-1 py-3.5 rounded-lg font-bold text-white transition-all text-[14px] ${!isStepValid() ? 'bg-[#C5CBD8] cursor-not-allowed' : 'bg-[#C0392B] hover:-translate-y-px hover:shadow'}`}
              >
                {step === 4 ? 'Almost Done →' : 'Next →'}
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSubmitLead)}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-lg font-bold text-white bg-[#C0392B] transition-all text-[14px] flex items-center justify-center gap-2 hover:-translate-y-px hover:shadow disabled:opacity-75 disabled:cursor-wait"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Building your plan...</> : 'Get My Free NPI Plan →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
