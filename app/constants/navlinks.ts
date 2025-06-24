export const slogan = "Elevate Your Code from Functional to Exceptional";

export const content = [
  { name: "articles", path: "articles" },
  { name: "tutorials", path: "tutorials" },
  { name: "courses", path: "courses" },
  { name: "programs", path: "programs" },
  { name: "challenges", path: "challenges" },
];

export const platform = [
  { name: "about", path: "about" },
  { name: "contact", path: "contact" },
  { name: "support", path: "support" },
  { name: "FAQs", path: "#faqs" },
];

export const legal = [
  { name: "terms", path: "terms" },
  { name: "privacy", path: "privacy" },
];

export const social = [
  { name: "X (formerly twitter)", path: "https://twitter.com/codingsimba_" },
  {
    name: "LinkedIn",
    path: "https://www.linkedin.com/in/christopher-sesugh-265332176/",
  },
  { name: "Github", path: "https://github.com/codingsimba-dev" },
  { name: "YouTube", path: "https://www.youtube.com/@codingsimba" },
];

export const navLinks = [
  ...content,
  ...platform.filter((link) => link.path !== "#faqs"),
].filter((item) => !item.path.includes("contact"));
