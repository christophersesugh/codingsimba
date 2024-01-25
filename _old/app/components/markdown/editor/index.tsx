import React from "react";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { common, createLowlight } from "lowlight";
// @ts-ignore
import { Markdown } from "tiptap-markdown";
import { CodeBlock } from "./code-block";
import { MenuBar } from "./menu-bar";

type EditorProps = {
  value?: string;
  onChange: (event: any) => void;
  label: string;
  name: string;
  id: string;
};

const lowlight = createLowlight(common);

export function Editor({ value = "", onChange, label, name, id }: EditorProps) {
  const editor = useEditor({
    onUpdate: React.useCallback(
      ({ editor }: any) => {
        const markdown = editor.storage.markdown.getMarkdown();
        /**
         * We need to handle onChange mannualy to update the editor value in the form input
         */
        onChange({ target: { name, value: markdown } });
      },
      [name, onChange],
    ),
    extensions: [
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "text-blue-500",
        },
      }),
      // @ts-ignore: this is an issue from the tip tap lib builders
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        // @ts-ignore
        Text: true,
        Document: true,
        codeBlock: false,
        Paragraph: true,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Start typing…",
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
      }).configure({ lowlight }),
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: "tight",
        bulletListMarker: "-",
        linkify: true,
        breaks: true,
        transformPastedText: false,
        transformCopiedText: false,
      }),
    ],
    content: value,
  });

  return (
    <div>
      <label htmlFor={id} className="capitalize">
        {label}
      </label>
      <input
        type="hidden"
        value={value}
        name={name}
        id={id}
        aria-labelledby={label}
      />
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
