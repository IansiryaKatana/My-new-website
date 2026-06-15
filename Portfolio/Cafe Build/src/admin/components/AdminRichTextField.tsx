import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { adminInput, adminLabel } from '../adminClassNames'

interface AdminRichTextFieldProps {
  label: string
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function AdminRichTextField({
  label,
  value,
  onChange,
  placeholder = 'Write content…',
}: AdminRichTextFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [editor, value])

  const toggle = (command: () => void) => {
    command()
    editor?.chain().focus().run()
  }

  return (
    <div className="space-y-2">
      <label className={adminLabel}>{label}</label>
      <div
        className={cn(
          adminInput,
          'admin-rich-text overflow-hidden p-0',
        )}
      >
        {editor ? (
          <div className="admin-rich-text-toolbar">
            <button
              type="button"
              className="rounded px-2 py-1 text-xs font-semibold hover:bg-[var(--admin-primary-soft)]"
              onClick={() => toggle(() => editor.chain().focus().toggleBold().run())}
            >
              Bold
            </button>
            <button
              type="button"
              className="rounded px-2 py-1 text-xs font-semibold hover:bg-[var(--admin-primary-soft)]"
              onClick={() => toggle(() => editor.chain().focus().toggleItalic().run())}
            >
              Italic
            </button>
            <button
              type="button"
              className="rounded px-2 py-1 text-xs font-semibold hover:bg-[var(--admin-primary-soft)]"
              onClick={() => toggle(() => editor.chain().focus().toggleBulletList().run())}
            >
              List
            </button>
          </div>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
