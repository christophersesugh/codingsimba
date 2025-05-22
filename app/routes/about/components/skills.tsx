import { SectionHeader } from "./section-header";
import cs from "../../../assets/images/cs.png";

export function Skills() {
  return (
    <div className="mb-24">
      <SectionHeader
        title="My Skills"
        description="I've developed expertise in various technologies and
          methodologies throughout my career."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="aspect-square w-full">
              <img src={cs} alt={skill.name} className="w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="mb-1 text-xl font-bold">{skill.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {skill.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const skills = [
  {
    name: "Frontend Development",
    description:
      "Expert in React, React Router, Next.js, and modern JavaScript. I build responsive, accessible, and performant user interfaces.",
    icon: "/placeholder.svg?height=300&width=300&text=FE",
  },
  {
    name: "Backend Engineering",
    description:
      "Proficient in Node.js, Express, SQL/NoSQL databases, and database design. I create scalable and secure server-side applications.",
    icon: "/placeholder.svg?height=300&width=300&text=BE",
  },
  {
    name: "Technical Education",
    description:
      "Experienced in creating educational content that breaks down complex topics into understandable lessons.",
    icon: "/placeholder.svg?height=300&width=300&text=ED",
  },
];
