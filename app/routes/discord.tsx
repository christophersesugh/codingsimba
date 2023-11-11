import React from "react";
import { BsDiscord } from "react-icons/bs";
import { PageHeader } from "~/components/home/page-header";
import { HeaderButton } from "~/components/header-button";
import { Section } from "~/components/section";
import { Markdown } from "~/components/markdown/mdx";
import { DiscordButton } from "~/components/discord-button";
// import { metaData } from "~/utils/meta";

// export const meta = metaData({ title: "Discord", url: "discord" });

export default function Discord() {
  return (
    <>
      <PageHeader
        title="Join Coding Simba's discord community for engaging conversations on all things Tech!"
        headerImage={
          <BsDiscord className="text-[18rem] block animate-pulse mx-auto" />
        }
      >
        <HeaderButton
          to="#reasons"
          buttonText="Why you should join CS' discord community..."
          otherProps={<DiscordButton />}
        />
      </PageHeader>
      <Section className="max-w-3xl flex flex-col items-center mx-8">
        <div className="dark:text-slate-300 text-slate-600" id="reasons">
          <Markdown source={content} />
        </div>{" "}
        <DiscordButton />
      </Section>
    </>
  );
}

const content = `
## Here is why you should join the community

1. **Expert Guidance:** Gain access to a community of tech enthusiasts and experts who can provide guidance, 
answer your questions, and offer insights into coding, programming, and technology.

2. **Learning Opportunities:** Participate in discussions, workshops, and events that provide valuable learning experiences. 
Whether you're a beginner or an experienced coder, there's always something new to discover.

3. **Networking:** Connect with like-minded individuals who share your passion for technology. Build professional connections, 
collaborate on projects, and exchange ideas in a supportive environment.
4. **Exclusive Content:** Get early access to blog updates, tutorials, and exclusive content that's not available elsewhere. 
Stay up-to-date with the latest tech trends and advancements.
5. **Community and Fun:** Beyond the technical aspects, we foster a welcoming and fun community. Engage in casual conversations, 
gaming, and social activities to unwind and enjoy the camaraderie of fellow tech enthusiasts.
`;
