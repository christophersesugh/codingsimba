import { SectionHeader } from "./section-header";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Github, Linkedin, Globe, Award } from "lucide-react";

export function Team() {
  return (
    <section className="mb-24">
      <SectionHeader
        title="Our Expert Team"
        description="Meet the industry professionals and subject matter experts who collaborate to create our world-class educational content."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <Card key={index} className="overflow-hidden pt-0">
            <div className="aspect-square overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
              </div>

              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                {member.bio}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {member.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {member.social?.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.social?.website && (
                  <a
                    href={member.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-blue-50 p-8 dark:bg-blue-950/30">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <Award className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="mb-4 text-2xl font-bold">Join Our Team</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            We&apos;re always looking for experienced developers and
            professionals who are passionate about sharing their knowledge. If
            you&apos;re interested in creating educational content or
            contributing to our platform, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Badge variant="outline" className="text-sm">
              Industry Experience Required
            </Badge>
            <Badge variant="outline" className="text-sm">
              Collaborative Mindset
            </Badge>
            <Badge variant="outline" className="text-sm">
              Remote Work Available
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

const teamMembers = [
  {
    name: "Christopher Sesugh",
    role: "Platform Founder & Lead Developer",
    bio: "Full-stack developer with 8+ years of experience in React, Node.js, and modern web technologies. Passionate about building scalable applications and making complex programming concepts accessible to everyone.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    specialties: ["React", "Node.js", "TypeScript", "Full-Stack"],
    social: {
      github: "https://github.com/codingsimba-dev",
      linkedin: "https://www.linkedin.com/in/christopher-sesugh-265332176/",
      website: "https://codingsimba.com",
    },
  },
  {
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    bio: "Frontend specialist with expertise in React, Vue.js, and modern CSS. Former senior developer at tech companies, focused on creating intuitive user experiences and scalable frontend architectures.",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    specialties: ["React", "Vue.js", "CSS", "UI/UX"],
    social: {
      github: "https://github.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
    },
  },
  {
    name: "Marcus Rodriguez",
    role: "DevOps & Backend Engineer",
    bio: "DevOps engineer and backend specialist with experience in cloud infrastructure, microservices, and scalable system design. Expert in building robust, high-performance backend systems.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    specialties: ["Node.js", "Docker", "AWS", "Microservices"],
    social: {
      github: "https://github.com/marcusrodriguez",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
    },
  },
  {
    name: "Aisha Patel",
    role: "Data Scientist & ML Engineer",
    bio: "Data scientist and machine learning engineer with a PhD in Computer Science. Specializes in Python, TensorFlow, and practical AI applications for real-world problems and business solutions.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    specialties: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
    social: {
      github: "https://github.com/aishapatel",
      linkedin: "https://linkedin.com/in/aishapatel",
    },
  },
  {
    name: "David Kim",
    role: "Mobile App Developer",
    bio: "Mobile app developer with expertise in React Native, Flutter, and native iOS/Android development. Has published multiple successful apps and specializes in cross-platform mobile solutions.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    specialties: ["React Native", "Flutter", "iOS", "Android"],
    social: {
      github: "https://github.com/davidkim",
      linkedin: "https://linkedin.com/in/davidkim",
    },
  },
  {
    name: "Emily Watson",
    role: "Senior UX/UI Designer",
    bio: "Senior UX designer with 10+ years of experience in user research, interface design, and design systems. Specializes in creating user-centered designs that drive engagement and usability.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    specialties: ["UX Design", "UI Design", "Figma", "Design Systems"],
    social: {
      linkedin: "https://linkedin.com/in/emilywatson",
      website: "https://emilywatson.design",
    },
  },
];
