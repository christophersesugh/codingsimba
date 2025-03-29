import React from "react";

type SidebarContextType = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined,
);

function SidebarProvider(props: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);

  const contextValue = React.useMemo(
    () => ({
      open,
      openSidebar: () => setOpen(true),
      closeSidebar: () => setOpen(false),
      toggleSidebar: () => setOpen((prev) => !prev),
    }),
    [open],
  );

  return <SidebarContext.Provider value={contextValue} {...props} />;
}

function useSidebar() {
  const context = React.use(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within an SidebarProvider");
  }
  return context;
}

export { useSidebar, SidebarProvider };
