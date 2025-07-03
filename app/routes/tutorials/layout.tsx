import { Outlet } from "react-router";
// import { DetailsHeader } from "~/components/details-header";

export default function TutorialLayout() {
  return (
    <div>
      {/* <DetailsHeader title="Tutorials" /> */}
      <Outlet />
    </div>
  );
}
