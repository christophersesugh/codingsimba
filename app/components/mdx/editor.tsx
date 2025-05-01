import React from "react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";

type MarkdownProps = {
  value?: string;
  setValue: (value: string) => void;
};

function MilkdownEditor(props: MarkdownProps) {
  const { value = "", setValue } = props;
  const lastValueRef = React.useRef(value);

  const handleChange = React.useCallback(
    (markdown: string) => {
      if (markdown !== lastValueRef.current) {
        lastValueRef.current = markdown;
        setValue(markdown);
      }
    },
    [setValue],
  );

  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: value,
      features: {
        [Crepe.Feature.ImageBlock]: false,
        [Crepe.Feature.Latex]: false,
        [Crepe.Feature.Table]: false,
        [Crepe.Feature.LinkTooltip]: false,
      },
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: "Write something...",
          mode: "block",
        },
      },
    });

    crepe.on((view) => {
      view.markdownUpdated((_, markdown) => {
        console.log("Markdown updated:", markdown);
        handleChange(markdown);
      });
    });

    return crepe;
  });

  return <Milkdown />;
}

export const MDXEditor = React.memo((props: MarkdownProps) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor {...props} />
    </MilkdownProvider>
  );
});

MDXEditor.displayName = "MDXEditor";
