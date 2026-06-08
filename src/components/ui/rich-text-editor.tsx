"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RichEditorInstance = {
  editorRef: React.RefObject<HTMLDivElement | null>;
  isActive: (format: string) => boolean;
  getHTML: () => string;
  getLinkHref: () => string;
  saveSelection: () => void;
  setContent: (html: string) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleOrderedList: () => void;
  toggleBulletList: () => void;
  insertLink: (url: string) => void;
  removeLink: () => void;
  insertImage: (src: string, alt: string) => void;
  insertHTML: (html: string) => void;
  /** @internal used by RichEditorContent */
  _handleInput: () => void;
  /** @internal used by RichEditorContent */
  _handleSelectionChange: () => void;
  /** @internal used by RichEditorContent */
  _placeholder: string;
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useRichEditor({
  onUpdate,
  placeholder = "Write something…",
}: {
  onUpdate?: (html: string) => void;
  placeholder?: string;
} = {}): RichEditorInstance {
  const editorRef = useRef<HTMLDivElement>(null);
  const formatsRef = useRef<Set<string>>(new Set());
  const savedRangeRef = useRef<Range | null>(null);
  const [, rerender] = useState(0);

  const notify = useCallback(() => {
    onUpdate?.(editorRef.current?.innerHTML ?? "");
  }, [onUpdate]);

  const refreshFormats = useCallback(() => {
    const next = new Set<string>();
    try {
      if (document.queryCommandState("bold")) next.add("bold");
      if (document.queryCommandState("italic")) next.add("italic");
      if (document.queryCommandState("underline")) next.add("underline");
    } catch {
      // queryCommandState can throw in some contexts
    }

    const sel = window.getSelection();
    if (sel?.rangeCount) {
      let node: Node | null = sel.getRangeAt(0).startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === "OL") next.add("orderedList");
        if (node.nodeName === "UL") next.add("bulletList");
        if (node.nodeName === "A") next.add("link");
        node = node.parentNode;
      }
    }

    const prev = formatsRef.current;
    const changed = next.size !== prev.size || [...next].some(f => !prev.has(f));
    if (changed) {
      formatsRef.current = next;
      rerender(n => n + 1);
    }
  }, []);

  const exec = useCallback(
    (cmd: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val);
      refreshFormats();
      notify();
    },
    [refreshFormats, notify],
  );

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel?.rangeCount) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
  }, []);

  const restoreSelection = useCallback(() => {
    const r = savedRangeRef.current;
    if (!r) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  }, []);

  const getLinkHref = useCallback((): string => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return "";
    let node: Node | null = sel.getRangeAt(0).startContainer;
    while (node && node !== editorRef.current) {
      if (node.nodeName === "A") return (node as HTMLAnchorElement).href;
      node = node.parentNode;
    }
    return "";
  }, []);

  const insertLink = useCallback(
    (url: string) => {
      restoreSelection();
      editorRef.current?.focus();
      document.execCommand("createLink", false, url);
      // Apply target="_blank" on the freshly-created <a>
      const sel = window.getSelection();
      if (sel?.rangeCount) {
        let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
        if (node?.nodeName !== "A") node = node?.parentNode ?? null;
        if (node?.nodeName === "A") {
          const a = node as HTMLAnchorElement;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.className = "tiptap-link";
        }
      }
      refreshFormats();
      notify();
    },
    [restoreSelection, refreshFormats, notify],
  );

  const removeLink = useCallback(() => {
    restoreSelection();
    editorRef.current?.focus();
    document.execCommand("unlink", false);
    refreshFormats();
    notify();
  }, [restoreSelection, refreshFormats, notify]);

  const insertImage = useCallback(
    (src: string, alt: string) => {
      restoreSelection();
      editorRef.current?.focus();
      document.execCommand("insertHTML", false, `<img src="${src}" alt="${alt}" class="tiptap-image" />`);
      notify();
    },
    [restoreSelection, notify],
  );

  const insertHTML = useCallback(
    (html: string) => {
      restoreSelection();
      editorRef.current?.focus();
      document.execCommand("insertHTML", false, html);
      notify();
    },
    [restoreSelection, notify],
  );

  const setContent = useCallback((html: string) => {
    const el = editorRef.current;
    if (el) el.innerHTML = html;
  }, []);

  const handleInput = useCallback(() => {
    refreshFormats();
    notify();
  }, [refreshFormats, notify]);

  return {
    editorRef,
    isActive: (f: string) => formatsRef.current.has(f),
    getHTML: () => editorRef.current?.innerHTML ?? "",
    getLinkHref,
    saveSelection,
    setContent,
    toggleBold: () => exec("bold"),
    toggleItalic: () => exec("italic"),
    toggleUnderline: () => exec("underline"),
    toggleOrderedList: () => exec("insertOrderedList"),
    toggleBulletList: () => exec("insertUnorderedList"),
    insertLink,
    removeLink,
    insertHTML,
    insertImage,
    _handleInput: handleInput,
    _handleSelectionChange: refreshFormats,
    _placeholder: placeholder,
  };
}

// ─── RichEditorContent component ─────────────────────────────────────────────

type RichEditorContentProps = {
  editor: RichEditorInstance;
  /** HTML string used to seed the editor on first mount. */
  initialContent?: string;
  className?: string;
};

export function RichEditorContent({ editor, initialContent, className }: RichEditorContentProps) {
  const [isEmpty, setIsEmpty] = useState(!initialContent);

  // Seed content synchronously before first paint to avoid a flash of empty editor
  useLayoutEffect(() => {
    const el = editor.editorRef.current;
    if (!el || !initialContent) return;
    el.innerHTML = initialContent;
    const text = el.textContent?.trim() ?? "";
    setIsEmpty(!text && !el.querySelector("img"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  // Track emptiness for external setContent() calls (e.g. form reset)
  useEffect(() => {
    const el = editor.editorRef.current;
    if (!el) return;
    const check = () => {
      const text = el.textContent?.trim() ?? "";
      setIsEmpty(!text && !el.querySelector("img"));
    };
    const observer = new MutationObserver(check);
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- editorRef is stable

  return (
    <div className="relative">
      <div
        ref={editor.editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={editor._handleInput}
        onKeyUp={editor._handleSelectionChange}
        onMouseUp={editor._handleSelectionChange}
        className={cn("outline-none", className)}
      />
      {isEmpty && (
        <span className="text-text-muted pointer-events-none absolute inset-0 select-none px-3 py-2 text-sm">
          {editor._placeholder}
        </span>
      )}
    </div>
  );
}
