import Highlight from '@tiptap/extension-highlight';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Redo2,
    Undo2,
} from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export default function RichTextEditor({
    content,
    onChange,
    placeholder = 'Ceritakan rasa, aroma, dan karakter kopi ini.',
}: {
    content: string;
    placeholder?: string;
    onChange: (html: string) => void;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Highlight],
        content,
        editorProps: {
            attributes: {
                class: 'min-h-40 px-3 py-2 text-sm leading-6 outline-none',
            },
        },
        onUpdate: ({ editor: updatedEditor }) =>
            onChange(updatedEditor.getHTML()),
    });
    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border bg-canvas">
            <div className="flex flex-wrap gap-1 border-b p-2">
                <EditorButton
                    editor={editor}
                    label="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Highlight"
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                >
                    <Highlighter />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Bullets"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Numbered list"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 />
                </EditorButton>
                <EditorButton
                    editor={editor}
                    label="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 />
                </EditorButton>
            </div>
            <div className="relative">
                <EditorContent editor={editor} />
                {editor.isEmpty && (
                    <span className="pointer-events-none absolute top-2 left-3 text-sm text-muted-soft">
                        {placeholder}
                    </span>
                )}
            </div>
        </div>
    );
}

function EditorButton({
    editor,
    label,
    onClick,
    children,
}: {
    editor: Editor;
    label: string;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={label}
            disabled={!editor.isEditable}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}
