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
import { uploadFile } from "@/lib/actions/media"
import { useState } from "react"
import { toast } from "sonner"
import { Upload, Loader2 } from "lucide-react"

export function UploadMediaDialog() {
    const [open, setOpen] = useState(false)
    const [uploading, setUploading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setUploading(true)

        const formData = new FormData(event.currentTarget)
        const result = await uploadFile(formData)

        setUploading(false)

        if (result.success) {
            setOpen(false)
            toast.success("File uploaded successfully")
        } else {
            toast.error("Upload failed")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                    <DialogDescription>
                        Upload images or documents to your library.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file">File</Label>
                        <Input id="file" name="file" type="file" required accept="image/*,application/pdf" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={uploading}>
                            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
