import { Form, useNavigation } from "react-router";
import { Github, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";

export function GithubButton({ action }: { action: string }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("intent") === "submit";
  return (
    <Form action={action} method="post">
      <Button variant="outline" type="submit" className="w-full">
        {isSubmitting ? (
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        ) : (
          <Github className="mr-2 size-4" />
        )}
        GitHub
      </Button>
    </Form>
  );
}
