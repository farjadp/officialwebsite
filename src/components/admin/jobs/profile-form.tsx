"use client"

import { useActionState } from "react"
import { saveProfileAction, type ProfileFormState } from "@/lib/jobs/actions"

const INPUT =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B4B43] focus:outline-none focus:ring-1 focus:ring-[#1B4B43]"

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-900">{label}</label>
            {hint && <p className="mb-2 text-xs leading-relaxed text-slate-500">{hint}</p>}
            {children}
        </div>
    )
}

export function ProfileForm({ initial }: {
    initial: {
        headline: string
        summary: string
        authCA: string
        authUS: string
        lanes: string
        exclude: string
        name: string
        email: string
        phone: string
        location: string
        links: string
        history: string
        education: string
        certifications: string
        skills: string
    }
}) {
    const [state, action, isPending] = useActionState<ProfileFormState, FormData>(saveProfileAction, {})

    return (
        <form action={action} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Field id="headline" label="Headline" hint="One line: what you are, in the words a recruiter would search for.">
                <input id="headline" name="headline" defaultValue={initial.headline} maxLength={300} className={INPUT} />
            </Field>

            <Field
                id="summary"
                label="Summary"
                hint="What the scorer reads about you. Experience, results with numbers, credentials, what you want next. Nothing is scored until this is filled in."
            >
                <textarea id="summary" name="summary" defaultValue={initial.summary} rows={12} maxLength={8000} className={INPUT} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field id="authCA" label="Work authorisation — Canada">
                    <textarea id="authCA" name="authCA" defaultValue={initial.authCA} rows={3} maxLength={300} className={INPUT} />
                </Field>
                <Field id="authUS" label="Work authorisation — United States">
                    <textarea id="authUS" name="authUS" defaultValue={initial.authUS} rows={3} maxLength={300} className={INPUT} />
                </Field>
            </div>

            <Field
                id="lanes"
                label="Lanes"
                hint="One per line, as “Label: keyword, keyword”. A posting is kept when its title contains one of a lane’s keywords as whole words. Changing these re-sorts every posting on the next run."
            >
                <textarea
                    id="lanes"
                    name="lanes"
                    defaultValue={initial.lanes}
                    rows={7}
                    placeholder="Product: product manager, head of product"
                    className={`${INPUT} font-mono text-[13px]`}
                />
            </Field>

            <Field id="exclude" label="Never show titles containing" hint="Separated by commas. These beat a lane match.">
                <input id="exclude" name="exclude" defaultValue={initial.exclude} placeholder="intern, junior" className={INPUT} />
            </Field>

            <div className="border-t border-slate-200 pt-6">
                <h2 className="text-base font-bold text-slate-900">What résumés are built from</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Every tailored résumé copies these exactly. The model chooses and rephrases; it cannot add an
                    employer, a date, a title or a number that is not here.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Name on the résumé">
                    <input id="name" name="name" defaultValue={initial.name} maxLength={120} className={INPUT} />
                </Field>
                <Field id="email" label="Email">
                    <input id="email" name="email" type="email" defaultValue={initial.email} maxLength={200} className={INPUT} />
                </Field>
                <Field id="phone" label="Phone">
                    <input id="phone" name="phone" defaultValue={initial.phone} maxLength={60} className={INPUT} />
                </Field>
                <Field id="location" label="Location">
                    <input id="location" name="location" defaultValue={initial.location} maxLength={120} className={INPUT} />
                </Field>
            </div>

            <Field id="links" label="Links" hint="LinkedIn, website, GitHub — separated by commas.">
                <input id="links" name="links" defaultValue={initial.links} className={INPUT} />
            </Field>

            <Field
                id="history"
                label="Career history"
                hint="One block per role. Each role has ONE start and end date, used on every résumé. List every title that was true for it; each résumé picks the one that fits the posting. Facts are what the bullets are written from — put the real numbers here."
            >
                <textarea
                    id="history"
                    name="history"
                    defaultValue={initial.history}
                    rows={22}
                    placeholder={"## Company | City | 2021-04 – present\ntitles: Founder & CEO, CTO\n- What was done, with the real numbers"}
                    className={`${INPUT} font-mono text-[13px]`}
                />
            </Field>

            <Field id="education" label="Education" hint="One per line: Degree | School | Year">
                <textarea id="education" name="education" defaultValue={initial.education} rows={5} className={`${INPUT} font-mono text-[13px]`} />
            </Field>

            <Field id="certifications" label="Certifications and courses" hint="One per line.">
                <textarea id="certifications" name="certifications" defaultValue={initial.certifications} rows={4} className={INPUT} />
            </Field>

            <Field id="skills" label="Skills" hint="Separated by commas. Only what you could be interviewed on.">
                <textarea id="skills" name="skills" defaultValue={initial.skills} rows={3} className={INPUT} />
            </Field>

            <div className="flex items-start gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-[#1B4B43] px-4 py-2 text-sm font-semibold text-white hover:bg-[#153b35] disabled:opacity-50"
                >
                    {isPending ? "Saving…" : "Save profile"}
                </button>
                {state.saved && <p role="status" className="pt-2 text-sm text-emerald-700">Saved</p>}
                {state.errors && (
                    <ul role="alert" className="space-y-1 pt-2 text-sm text-rose-700">
                        {state.errors.map((error) => <li key={error}>{error}</li>)}
                    </ul>
                )}
            </div>
        </form>
    )
}
