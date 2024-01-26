import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { metaFn } from "~/utils/meta";

export const meta = metaFn;

export default function NotFoundRoute() {
  return (
    <div className="px-4">
      <div className="max-w-md border mx-auto  flex flex-col items-center rounded-md mt-8 mb-16 p-4 ">
        <h1 className="text-[5rem]">
          4<span className="text-blue-500">0</span>4
        </h1>
        <p className="text-[2rem]">Ooops! page not found</p>
        <p className="text-lg">
          The page you requested for could not be found.
        </p>
        <Button className="rounded-md border-2 p-2 mt-4 uppercase" asChild>
          <Link to="/">back home</Link>
        </Button>
      </div>
    </div>
  );
}
