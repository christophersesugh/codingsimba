import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("terms", "routes/terms.tsx"),
  route("about", "routes/about/index.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("verify", "routes/verify.tsx"),
  route("signup", "routes/signup.tsx"),
  route("signin", "routes/signin.tsx"),
  route("profile", "routes/profile/index.tsx"),
  route("*", "routes/not-found.tsx"),

  // Resource routes
  route("download-user-data", "routes/resources/download-user-data.ts"),

  // Action routes
  route("logout", "routes/actions/logout.ts"),
  route("set-theme", "routes/actions/set-theme.ts"),

  ...prefix("contact", [
    index("routes/contact/index.tsx"),
    route("success", "routes/contact/success.tsx"),
    route("webhook", "routes/contact/webhook.tsx"),
  ]),

  ...prefix("auth", [
    route(":provider", "routes/provider/index.ts"),
    route(":provider/callback", "routes/provider/callback.ts"),
  ]),

  ...prefix("onboarding", [
    index("routes/onboarding/index.tsx"),
    route(":provider", "routes/onboarding/provider.tsx"),
  ]),

  ...prefix("articles", [
    index("routes/articles/index.tsx"),
    route(":articleSlug", "routes/articles/article.tsx"),
  ]),

  ...prefix("courses", [
    index("routes/courses/index.tsx"),
    route(":courseId", "routes/courses/course.tsx", [
      route("lessons/:lessonId", "routes/courses/lesson.tsx"),
    ]),
  ]),

  ...prefix("tutorials", [
    index("routes/tutorials/index.tsx"),
    route(":tutorialId", "routes/tutorials/tutorial.tsx", [
      route("lessons/:lessonId", "routes/tutorials/lesson.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
