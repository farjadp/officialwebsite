'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import * as LucideIcons from "lucide-react"

// Curated list of common icons suitable for categories
const iconNames = [
    "Activity", "Airplay", "AlertCircle", "AlertOctagon", "AlertTriangle", "AlignCenter", "AlignJustify", "AlignLeft", "AlignRight", "Anchor", "Aperture", "Archive", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "AtSign", "Award", "BarChart", "BarChart2", "Battery", "BatteryCharging", "Bell", "BellOff", "Bluetooth", "Bold", "Book", "BookOpen", "Bookmark", "Box", "Briefcase", "Calendar", "Camera", "Cast", "Check", "CheckCircle", "CheckSquare", "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp", "ChevronsDown", "ChevronsLeft", "ChevronsRight", "ChevronsUp", "Chrome", "Circle", "Clipboard", "Clock", "Cloud", "CloudDrizzle", "CloudLightning", "CloudOff", "CloudRain", "CloudSnow", "Code", "Codepen", "Codesandbox", "Coffee", "Columns", "Command", "Compass", "Copy", "CornerDownLeft", "CornerDownRight", "CornerLeftDown", "CornerLeftUp", "CornerRightDown", "CornerRightUp", "CornerUpLeft", "CornerUpRight", "Cpu", "CreditCard", "Crop", "Crosshair", "Database", "Delete", "Disc", "Divide", "DivideCircle", "DivideSquare", "DollarSign", "Download", "DownloadCloud", "Dribbble", "Droplet", "Edit", "Edit2", "Edit3", "ExternalLink", "Eye", "EyeOff", "Facebook", "FastForward", "Feather", "Figma", "File", "FileMinus", "FilePlus", "FileText", "Film", "Filter", "Flag", "Folder", "FolderMinus", "FolderPlus", "Framer", "Frown", "Gift", "GitBranch", "GitCommit", "GitMerge", "GitPullRequest", "Github", "Gitlab", "Globe", "Grid", "HardDrive", "Hash", "Headphones", "Heart", "HelpCircle", "Hexagon", "Home", "Image", "Inbox", "Info", "Instagram", "Italic", "Key", "Layers", "Layout", "LifeBuoy", "Link", "Link2", "Linkedin", "List", "Loader", "Lock", "LogIn", "LogOut", "Mail", "Map", "MapPin", "Maximize", "Maximize2", "Meh", "Menu", "MessageCircle", "MessageSquare", "Mic", "MicOff", "Minimize", "Minimize2", "Minus", "MinusCircle", "MinusSquare", "Monitor", "Moon", "MoreHorizontal", "MoreVertical", "MousePointer", "Move", "Music", "Navigation", "Navigation2", "Octagon", "Package", "Paperclip", "Pause", "PauseCircle", "PenTool", "Percent", "Phone", "PhoneCall", "PhoneForwarded", "PhoneIncoming", "PhoneMissed", "PhoneOff", "PhoneOutgoing", "PieChart", "Play", "PlayCircle", "Plus", "PlusCircle", "PlusSquare", "Pocket", "Power", "Printer", "Radio", "RefreshCcw", "RefreshCw", "Repeat", "Rewind", "RotateCcw", "RotateCw", "Rss", "Save", "Scissors", "Search", "Send", "Server", "Settings", "Share", "Share2", "Shield", "ShieldOff", "ShoppingBag", "ShoppingCart", "Shuffle", "Sidebar", "SkipBack", "SkipForward", "Slack", "Slash", "Sliders", "Smartphone", "Smile", "Speaker", "Square", "Star", "StopCircle", "Sun", "Sunrise", "Sunset", "Tablet", "Tag", "Target", "Terminal", "Thermometer", "ThumbsDown", "ThumbsUp", "ToggleLeft", "ToggleRight", "Tool", "Trash", "Trash2", "TrendingDown", "TrendingUp", "Triangle", "Truck", "Tv", "Twitch", "Twitter", "Type", "Umbrella", "Underline", "Unlock", "Upload", "UploadCloud", "User", "UserCheck", "UserMinus", "UserPlus", "UserX", "Users", "Video", "VideoOff", "Voicemail", "Volume", "Volume1", "Volume2", "VolumeX", "Watch", "Wifi", "WifiOff", "Wind", "X", "XCircle", "XOctagon", "XSquare", "Youtube", "Zap", "ZapOff", "ZoomIn", "ZoomOut"
]

interface IconPickerProps {
    value: string
    onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [open, setOpen] = React.useState(false)

    // Helper to render icon dynamically
    const renderIcon = (name: string) => {
        const Icon = (LucideIcons as any)[name]
        return Icon ? <Icon className="mr-2 h-4 w-4" /> : null
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? (
                        <div className="flex items-center">
                            {renderIcon(value)}
                            {value}
                        </div>
                    ) : (
                        "Select icon..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search icon..." />
                    <CommandList>
                        <CommandEmpty>No icon found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {iconNames.map((name) => (
                                <CommandItem
                                    key={name}
                                    value={name}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {renderIcon(name)}
                                    {name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
