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
    initial: { headline: string; summary: string; authCA: string; authUS: string; lanes: string; exclude: string }
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
