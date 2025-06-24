import { SectionHeader } from "./section-header";

export function Skills() {
  return (
    <div className="mb-24">
      <SectionHeader
        title="Our Expertise"
        description="We've developed comprehensive expertise in various technologies and methodologies to serve both individual learners and organizations."
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
      "Expert in React, React Router, Next.js, and modern JavaScript. We build responsive, accessible, and performant user interfaces for both individual projects and enterprise applications.",
    image:
      "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/6a1beb4623c0e86bcc3254a994cec4ed10991bce-640x407.jpg",
  },
  {
    name: "Backend Engineering",
    description:
      "Proficient in Node.js, Express, Hono.js, SQL/NoSQL databases, and database design. We create scalable and secure server-side applications that power modern web applications.",
    image:
      "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/7ff88e5847e470c807f1de576c0a33d23197992e-640x427.jpg",
  },
  {
    name: "Technical Education",
    description:
      "Experienced in creating educational content that breaks down complex topics into understandable lessons for both individual learners and organizational training programs.",
    image:
      "https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/1179fe58e7ea33cfa950572c09fa971f75219429-640x424.jpg",
  },
  {
    name: "Organizational Learning",
    description:
      "Specialized in designing structured learning programs, team training initiatives, and scalable educational solutions that help organizations grow their technical capabilities.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  },
  {
    name: "Program Development",
    description:
      "Creating comprehensive learning paths and certification programs that combine theoretical knowledge with practical, hands-on experience for real-world application.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Team Collaboration",
    description:
      "Building collaborative learning environments and tools that enable teams to learn together, track progress, and achieve shared learning objectives effectively.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];
