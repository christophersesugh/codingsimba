import React from "react";

type AuthDialogContextType = {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

const AuthDialogContext = React.createContext<
  AuthDialogContextType | undefined
>(undefined);

function AuthDialogProvider(props: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);

  const contextValue = React.useMemo(
    () => ({
      open,
      openDialog: () => setOpen(true),
      closeDialog: () => setOpen(false),
      toggleDialog: () => setOpen((prev) => !prev),
    }),
    [open],
  );

  return <AuthDialogContext.Provider value={contextValue} {...props} />;
}

function useAuthDialog() {
  const context = React.use(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider");
  }
  return context;
}

export { useAuthDialog, AuthDialogProvider };
