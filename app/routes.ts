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
  route("about", "routes/about/index.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("verify", "routes/verify.tsx"),
  route("signup", "routes/signup.tsx"),
  route("signin", "routes/signin.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("*", "routes/not-found.tsx"),

  // Resource routes
  route("download-user-data", "routes/resources/download-user-data.ts"),

  // Action routes
  route("signout", "routes/actions/signout.ts"),
  route("set-theme", "routes/actions/set-theme.ts"),
  route("content/webhook", "routes/actions/sanity-webhook.ts"),

  ...prefix("contact", [
    index("routes/contact/index.tsx"),
    route("success", "routes/contact/success.tsx"),
    route("webhook", "routes/contact/webhook.tsx"),
  ]),

  ...prefix("profile", [
    index("routes/profile/index.tsx"),
    route("change-password", "routes/profile/change-password.tsx"),
    route("change-email", "routes/profile/change-email.tsx"),
    route("change-photo", "routes/profile/change-photo.tsx"),
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
    layout("routes/courses/layout.tsx", [
      route(":courseId", "routes/courses/course.tsx", [
        route("modules/:moduleId", "routes/courses/module.tsx", [
          route("lessons/:lessonId", "routes/courses/lesson.tsx"),
        ]),
      ]),
    ]),
  ]),

  ...prefix("tutorials", [
    index("routes/tutorials/index.tsx"),
    layout("routes/tutorials/layout.tsx", [
      route(":tutorialId", "routes/tutorials/tutorial.tsx", [
        route("lessons/:lessonId", "routes/tutorials/lesson.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
