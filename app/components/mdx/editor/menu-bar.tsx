import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading4,
  Heading5,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/shadcn";
import type { MenuBarProps } from ".";

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return <Skeleton className="h-32" />;
  }
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg rounded-bl-none rounded-br-none border-b border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("bold") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Bold"
      >
        <Bold className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("italic") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Italic"
      >
        <Italic className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("strike") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Strike"
      >
        <Strikethrough className="size-4" />
      </button>
      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("heading", { level: 3 }) &&
            "bg-gray-100 dark:bg-gray-800",
        )}
        title="Heading 3"
      >
        <Heading3 className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("heading", { level: 4 }) &&
            "bg-gray-100 dark:bg-gray-800",
        )}
        title="Heading 4"
      >
        <Heading4 className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("heading", { level: 5 }) &&
            "bg-gray-100 dark:bg-gray-800",
        )}
        title="Heading 5"
      >
        <Heading5 className="size-4" />
      </button>
      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("code") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Code"
      >
        <Code className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("codeBlock") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Code Block"
      >
        <Code2 className="size-4" />
      </button>
      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("bulletList") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Bullet List"
      >
        <List className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("orderedList") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Ordered List"
      >
        <ListOrdered className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
          editor.isActive("blockquote") && "bg-gray-100 dark:bg-gray-800",
        )}
        title="Blockquote"
      >
        <Quote className="size-4" />
      </button>
      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Undo"
      >
        <Undo className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Redo"
      >
        <Redo className="size-4" />
      </button>
    </div>
  );
}
