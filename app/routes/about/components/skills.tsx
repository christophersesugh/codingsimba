import { SectionHeader } from "./section-header";

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
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-auto aspect-video h-[200px] w-full">
              <img
                src={skill.image}
                alt={skill.name}
                className="h-full min-h-full w-full object-cover"
              />
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
    image:
      "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/6a1beb4623c0e86bcc3254a994cec4ed10991bce-640x407.jpg",
  },
  {
    name: "Backend Engineering",
    description:
      "Proficient in Node.js, Express, Hono.js, SQL/NoSQL databases, and database design. I create scalable and secure server-side applications.",
    image:
      "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/7ff88e5847e470c807f1de576c0a33d23197992e-640x427.jpg",
  },
  {
    name: "Technical Education",
    description:
      "Experienced in creating educational content that breaks down complex topics into understandable lessons.",
    image:
      "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/1179fe58e7ea33cfa950572c09fa971f75219429-640x424.jpg",
  },
];
