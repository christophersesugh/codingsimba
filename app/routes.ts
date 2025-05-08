import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("terms", "routes/terms.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("verify", "routes/verify.tsx"),
  route("onboarding", "routes/onboarding.tsx"),
  route("profile", "routes/profile/index.tsx"),

  // Action routes
  route("logout", "routes/actions/logout.ts"),
  route("set-theme", "routes/actions/set-theme.ts"),

  // Resource routes
  route("download-user-data", "routes/resources/download-user-data.ts"),

  route("*", "routes/not-found.tsx"),

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
