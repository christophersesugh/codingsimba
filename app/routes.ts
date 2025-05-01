import {
  type RouteConfig,
  index,
  route,
  prefix,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("terms", "routes/terms.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("verify", "routes/verify.tsx"),
  route("onboarding", "routes/onboarding.tsx"),
  route("logout", "routes/logout.ts"),
  route("set-theme", "routes/actions/set-theme.ts"),
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

  layout("routes/profile/layout.tsx", [
    ...prefix("profile", [
      index("routes/profile/account.tsx"),
      route("courses", "routes/profile/courses.tsx"),
      route("certificates", "routes/profile/certificates.tsx"),
      route("subscription", "routes/profile/subscription.tsx"),
      route("notifications", "routes/profile/notifications.tsx"),
      route("billing-history", "routes/profile/billing-history.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
