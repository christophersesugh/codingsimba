import { redirect } from "react-router";
import { createThemeAction } from "remix-themes";
import { themeSessionResolver } from "~/utils/theme.server";

export const loader = () => redirect("/");

export const action = createThemeAction(themeSessionResolver);
