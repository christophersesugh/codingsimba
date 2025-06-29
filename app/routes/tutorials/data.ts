export interface Tutorial {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  tags: string[];
  hasVideo: boolean;
  date: string;
}

export const tutorials: Tutorial[] = [
  {
    id: "git-basics",
    title: "Git Basics: Version Control for Beginners",
    description:
      "Learn the fundamentals of Git version control and how to manage your code effectively.",
    image: "/placeholder.svg?height=400&width=600&text=Git+Basics",
    duration: "25 min",
    level: "Beginner",
    tags: ["Git", "Version Control", "Command Line"],
    hasVideo: true,
    date: "Mar 15, 2023",
  },
  {
    id: "docker-containers",
    title: "Docker Containers Explained",
    description:
      "Understand how Docker containers work and how to use them in your development workflow.",
    image: "/placeholder.svg?height=400&width=600&text=Docker+Containers",
    duration: "35 min",
    level: "Intermediate",
    tags: ["Docker", "Containers", "DevOps"],
    hasVideo: true,
    date: "Apr 22, 2023",
  },
  {
    id: "css-grid-layout",
    title: "Mastering CSS Grid Layout",
    description:
      "A comprehensive guide to using CSS Grid for modern web layouts.",
    image: "/placeholder.svg?height=400&width=600&text=CSS+Grid",
    duration: "20 min",
    level: "Intermediate",
    tags: ["CSS", "Web Design", "Layout"],
    hasVideo: false,
    date: "May 10, 2023",
  },
  {
    id: "typescript-interfaces",
    title: "TypeScript Interfaces and Types",
    description:
      "Learn how to use TypeScript interfaces and types to create robust applications.",
    image: "/placeholder.svg?height=400&width=600&text=TypeScript",
    duration: "30 min",
    level: "Intermediate",
    tags: ["TypeScript", "JavaScript", "Web Development"],
    hasVideo: true,
    date: "Jun 5, 2023",
  },
  {
    id: "react-hooks",
    title: "React Hooks Deep Dive",
    description:
      "An in-depth look at React hooks and how to use them effectively in your applications.",
    image: "/placeholder.svg?height=400&width=600&text=React+Hooks",
    duration: "40 min",
    level: "Advanced",
    tags: ["React", "JavaScript", "Hooks"],
    hasVideo: true,
    date: "Jul 18, 2023",
  },
  {
    id: "api-design",
    title: "RESTful API Design Best Practices",
    description:
      "Learn how to design clean, efficient, and developer-friendly RESTful APIs.",
    image: "/placeholder.svg?height=400&width=600&text=API+Design",
    duration: "35 min",
    level: "Intermediate",
    tags: ["API", "REST", "Backend"],
    hasVideo: false,
    date: "Aug 30, 2023",
  },
];
