import { useOptionalUser } from "~/hooks/user";
import { LiveChat } from "./live-chat";

export function AuthenticatedLiveChat() {
  const user = useOptionalUser();

  // Only render LiveChat if user is authenticated
  if (!user) {
    return null;
  }

  return <LiveChat />;
}
