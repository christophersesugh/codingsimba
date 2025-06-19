import { content, legal, platform, slogan, social } from "~/constants/navlinks";
import { NavLink } from "./nav-link";
import { Logo } from "./logo";
import { useLocation } from "react-router";
import { cn } from "~/utils/misc";

export function Footer() {
  const location = useLocation();
  const hideFooter =
    location.pathname.includes("signup") ||
    location.pathname.includes("signin");

  return (
    <footer
      className={cn("border-t border-gray-200 py-12 dark:border-gray-800", {
        "p hidden": hideFooter,
      })}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <section className="mb-6 md:mb-0">
            <Logo />
            <p className="mt-2 text-gray-500 dark:text-gray-400">{slogan}</p>
          </section>

          <section className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            <div>
              <h3 className="mb-3 font-medium">Content</h3>
              <ul className="-space-y-2">
                {content.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      key={item.name}
                      name={item.name}
                      path={item.path}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Platform</h3>
              <ul className="-space-y-2">
                {platform.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      key={item.name}
                      name={item.name}
                      path={item.path}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Legal</h3>
              <ul className="-space-y-2">
                {legal.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      key={item.name}
                      name={item.name}
                      path={item.path}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Social</h3>
              <ul className="-space-y-2">
                {social.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      key={item.name}
                      name={item.name}
                      path={item.path}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          © 2025 - present Coding Simba. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
