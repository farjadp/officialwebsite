"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { createSeries } from "@/lib/actions/series"
import { useActionState } from "react"
import { useState } from "react"

export function CreateSeriesSheet() {
    const [open, setOpen] = useState(false)
    const initialState = { message: "", errors: {} }
    // @ts-ignore
    const [state, formAction] = useActionState(createSeries, initialState)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>New Series</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create New Series</SheetTitle>
                    <SheetDescription>
                        Group related posts into a structured series.
                    </SheetDescription>
                </SheetHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                        {state.errors?.name && <p className="text-red-500 text-xs">{state.errors.name}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" required />
                        {state.errors?.slug && <p className="text-red-500 text-xs">{state.errors.slug}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" />
                    </div>
                    <SheetFooter>
                        <Button type="submit">Create Series</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
