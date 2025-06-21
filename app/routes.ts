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
  route("verify", "routes/auth/verify.tsx"),
  route("signup", "routes/auth/signup.tsx"),
  route("signin", "routes/auth/signin.tsx"),
  route("signout", "routes/auth/signout.ts"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("*", "routes/not-found.tsx"),

  // SEO
  // route("robots", "routes/seo/[robots.txt].ts"),
  // route("sitemap", "routes/seo/[sitemap.xml].ts"),

  // Resource routes
  route("set-theme", "routes/resources/set-theme.ts"),
  route("unsubscribe", "routes/resources/unsubscribe.ts"),
  route("content/webhook", "routes/resources/sanity-webhook.ts"),
  route("download-user-data", "routes/resources/download-user-data.ts"),

  ...prefix("contact", [
    index("routes/contact/index.tsx"),
    route("success", "routes/contact/success.tsx"),
    route("webhook", "routes/contact/webhook.tsx"),
  ]),

  ...prefix("profile", [
    index("routes/profile/index.tsx"),
    route("password", "routes/profile/password.tsx"),
    route("change-email", "routes/profile/change-email.tsx"),
    route("change-photo", "routes/profile/change-photo.tsx"),
  ]),

  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      index("routes/admin/index.tsx"),
      route("users", "routes/admin/users.tsx"),
      route("reviews", "routes/admin/reviews.tsx"),
      route("moderation", "routes/admin/moderation.tsx"),
    ]),
  ]),

  ...prefix("auth", [
    route("reset-password", "routes/auth/reset-password.tsx"),
    route(":provider", "routes/auth/provider/index.ts"),
    route(":provider/callback", "routes/auth/provider/callback.ts"),
  ]),

  ...prefix("onboarding", [
    index("routes/auth/onboarding/index.tsx"),
    route(":provider", "routes/auth/onboarding/provider.tsx"),
  ]),

  ...prefix("articles", [
    index("routes/articles/index.tsx"),
    route(":articleSlug", "routes/articles/article.tsx"),
  ]),

  ...prefix("programs", [
    index("routes/programs/index.tsx"),
    route(":programId", "routes/programs/program.tsx"),
  ]),

  ...prefix("tutorials", [
    index("routes/tutorials/index.tsx"),
    layout("routes/tutorials/layout.tsx", [
      route(":tutorialId", "routes/tutorials/tutorial.tsx", [
        route("lessons/:lessonId", "routes/tutorials/lesson.tsx"),
      ]),
    ]),
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
] satisfies RouteConfig;
