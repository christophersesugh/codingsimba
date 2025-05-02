import React from "react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Skeleton } from "../ui/skeleton";

type MarkdownProps = {
  value?: string;
  setValue: (value: string) => void;
};

function MilkdownEditor(props: MarkdownProps) {
  const { value = "", setValue } = props;
  const [mounted, setMounted] = React.useState(false);
  const lastValueRef = React.useRef(value);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
          text: "Press '/' for commands...",
          mode: "block",
        },
      },
    });

    crepe.on((view) => {
      view.markdownUpdated((_, markdown) => {
        handleChange(markdown);
      });
    });

    return crepe;
  });

  if (!mounted) return <Skeleton className="h-26" />;
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
