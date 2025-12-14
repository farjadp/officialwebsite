"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTopic } from "@/lib/actions/topics"
import { useActionState } from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function CreateTopicDialog() {
    const [open, setOpen] = useState(false)
    const initialState = { message: "", errors: {} }
    const [state, formAction] = useActionState(createTopic, initialState)

    useEffect(() => {
        if (state.message === "Topic created successfully") {
            setOpen(false)
            toast.success("Topic created")
        } else if (state.message && state.message !== initialState.message) {
            // toast.error(state.message) // Optional: show error toast
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Topic</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Topic</DialogTitle>
                    <DialogDescription>
                        Add a new topic to organize your content.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <div className="col-span-3">
                            <Input id="name" name="name" className="col-span-3" required />
                            {state.errors?.name && <p className="text-xs text-red-500 mt-1">{state.errors.name.join(", ")}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">
                            Slug
                        </Label>
                        <div className="col-span-3">
                            <Input id="slug" name="slug" className="col-span-3" required />
                            {state.errors?.slug && <p className="text-xs text-red-500 mt-1">{state.errors.slug.join(", ")}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
