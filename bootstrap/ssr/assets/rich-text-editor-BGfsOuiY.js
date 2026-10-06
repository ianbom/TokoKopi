import { t as Button } from "./button-Cl3HFMpR.js";
import { useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Bold, Highlighter, Italic, List, ListOrdered, Redo2, Undo2 } from "lucide-react";
import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
//#region resources/js/components/rich-text-editor.tsx
function RichTextEditor({ content, onChange, placeholder = "Ceritakan rasa, aroma, dan karakter kopi ini." }) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit, Highlight],
		content,
		editorProps: { attributes: { class: "min-h-40 px-3 py-2 text-sm leading-6 outline-none" } },
		onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getHTML())
	});
	useEffect(() => {
		if (editor && editor.getHTML() !== content) editor.commands.setContent(content);
	}, [content, editor]);
	if (!editor) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "border bg-canvas",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap gap-1 border-b p-2",
			children: [
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Bold",
					onClick: () => editor.chain().focus().toggleBold().run(),
					children: /* @__PURE__ */ jsx(Bold, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Italic",
					onClick: () => editor.chain().focus().toggleItalic().run(),
					children: /* @__PURE__ */ jsx(Italic, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Highlight",
					onClick: () => editor.chain().focus().toggleHighlight().run(),
					children: /* @__PURE__ */ jsx(Highlighter, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Bullets",
					onClick: () => editor.chain().focus().toggleBulletList().run(),
					children: /* @__PURE__ */ jsx(List, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Numbered list",
					onClick: () => editor.chain().focus().toggleOrderedList().run(),
					children: /* @__PURE__ */ jsx(ListOrdered, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Undo",
					onClick: () => editor.chain().focus().undo().run(),
					children: /* @__PURE__ */ jsx(Undo2, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Redo",
					onClick: () => editor.chain().focus().redo().run(),
					children: /* @__PURE__ */ jsx(Redo2, {})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [/* @__PURE__ */ jsx(EditorContent, { editor }), editor.isEmpty && /* @__PURE__ */ jsx("span", {
				className: "pointer-events-none absolute top-2 left-3 text-sm text-muted-soft",
				children: placeholder
			})]
		})]
	});
}
function EditorButton({ editor, label, onClick, children }) {
	return /* @__PURE__ */ jsx(Button, {
		type: "button",
		size: "icon",
		variant: "ghost",
		"aria-label": label,
		disabled: !editor.isEditable,
		onClick,
		children
	});
}
//#endregion
export { RichTextEditor as t };

//# sourceMappingURL=rich-text-editor-BGfsOuiY.js.map