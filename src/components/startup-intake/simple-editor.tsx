"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Link as LinkIcon,
} from 'lucide-react'

interface SimpleEditorProps {
    value: string
    onChange: (val: string) => void
    placeholder?: string
}

export function SimpleEditor({ value, onChange, placeholder = 'پاسخ خود را بنویسید...' }: SimpleEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[120px] p-4 text-[#1C1917]',
                dir: 'auto',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 shadow-sm transition-all duration-300 hover:border-stone-300 hover:bg-white focus-within:border-iran-lajvard focus-within:bg-white focus-within:ring-4 focus-within:ring-iran-lajvard/15 overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-stone-100/50 p-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`rounded p-2 transition-colors hover:bg-stone-200 ${editor.isActive('bold') ? 'bg-stone-200 text-iran-lajvard' : 'text-stone-600'}`}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`rounded p-2 transition-colors hover:bg-stone-200 ${editor.isActive('italic') ? 'bg-stone-200 text-iran-lajvard' : 'text-stone-600'}`}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-stone-300 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`rounded p-2 transition-colors hover:bg-stone-200 ${editor.isActive('bulletList') ? 'bg-stone-200 text-iran-lajvard' : 'text-stone-600'}`}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`rounded p-2 transition-colors hover:bg-stone-200 ${editor.isActive('orderedList') ? 'bg-stone-200 text-iran-lajvard' : 'text-stone-600'}`}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-stone-300 mx-1" />
                <button
                    onClick={() => {
                        const previousUrl = editor.getAttributes('link').href
                        const url = window.prompt('URL', previousUrl)
                        if (url === null) return
                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run()
                            return
                        }
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                    }}
                    className={`rounded p-2 transition-colors hover:bg-stone-200 ${editor.isActive('link') ? 'bg-stone-200 text-iran-lajvard' : 'text-stone-600'}`}
                    type="button"
                >
                    <LinkIcon className="h-4 w-4" />
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
