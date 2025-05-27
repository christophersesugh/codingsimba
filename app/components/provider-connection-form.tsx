import { Form } from "react-router";
import { z } from "zod";
import { useIsPending } from "~/utils/misc";
import { Button } from "~/components/ui/button";

const GITHUB_PROVIDER_NAME = "github";

export const providerNames = [GITHUB_PROVIDER_NAME] as const;
export const ProviderNameSchema = z.enum(providerNames);
export type ProviderName = z.infer<typeof ProviderNameSchema>;

export const providerLabels: Record<ProviderName, string> = {
  [GITHUB_PROVIDER_NAME]: "GitHub",
} as const;

export const providerIcons: Record<ProviderName, React.ReactNode> = {
  [GITHUB_PROVIDER_NAME]: <>Github</>,
} as const;

export function ProviderConnectionForm({
  redirectTo,
  type,
  providerName,
}: {
  redirectTo?: string | null;
  type: "Connect" | "Signin" | "Signup";
  providerName: ProviderName;
}) {
  const label = providerLabels[providerName];
  const formAction = `/auth/${providerName}`;
  const isPending = useIsPending({ formAction });
  return (
    <Form
      className="flex items-center justify-center gap-2"
      action={formAction}
      method="POST"
    >
      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        variant="secondary"
      >
        <span className="inline-flex items-center gap-1.5">
          <span>
            {type} with {label}
          </span>
        </span>
      </Button>
    </Form>
  );
}
