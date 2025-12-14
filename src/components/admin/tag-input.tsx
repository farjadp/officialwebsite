'use client'

import * as React from "react"
import { Check, ChevronsUpDown, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tag } from "@prisma/client"
import { createTag } from "@/app/actions/tags"
import { toast } from "sonner"

interface TagInputProps {
    selectedTagIds: string[]
    onTagsChange: (tags: string[]) => void
    availableTags: Tag[]
}

export function TagInput({ selectedTagIds, onTagsChange, availableTags: initialTags }: TagInputProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [availableTags, setAvailableTags] = React.useState<Tag[]>(initialTags)

    // Derived state for selected tags objects
    const selectedTags = React.useMemo(() => {
        return availableTags.filter(tag => selectedTagIds.includes(tag.id))
    }, [selectedTagIds, availableTags])

    const handleUnselect = (tagId: string) => {
        onTagsChange(selectedTagIds.filter(id => id !== tagId))
    }

    const handleCreateTag = async () => {
        if (!inputValue.trim()) return

        try {
            // Optimistic update
            const tempId = `temp-${Date.now()}`
            // We can't really optimistically update fully without ID, but we can try 
            // blocking simple rapid clicks.

            // Create slug
            const slug = inputValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

            const res = await createTag({ name: inputValue, slug })

            if (res.success && res.data) {
                const newTag = res.data
                setAvailableTags(prev => [...prev, newTag])
                onTagsChange([...selectedTagIds, newTag.id])
                setInputValue("")
                setOpen(false)
                toast.success(`Tag "${newTag.name}" created`)
            } else {
                toast.error(res.error || "Failed to create tag")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    // Filter tags to exclude already selected ones from the dropdown options 
    // (though sometimes it's nice to see them checked, but for multi-select, hiding or greying out is common. 
    // Let's keep them and show a checkmark)

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag.name}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => handleUnselect(tag.id)}
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between text-left font-normal"
                    >
                        {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select tags..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search or create tag..."
                            value={inputValue}
                            onValueChange={setInputValue}
                        />
                        <CommandList>
                            <CommandEmpty className="py-2 px-2 text-sm">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-muted-foreground">No tag found.</span>
                                    {inputValue && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full justify-start h-auto py-2 px-3"
                                            onClick={handleCreateTag}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create "{inputValue}"
                                        </Button>
                                    )}
                                </div>
                            </CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                {availableTags.map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        value={tag.name} // Search by name
                                        onSelect={() => {
                                            if (selectedTagIds.includes(tag.id)) {
                                                handleUnselect(tag.id)
                                            } else {
                                                onTagsChange([...selectedTagIds, tag.id])
                                            }
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedTagIds.includes(tag.id) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {tag.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
