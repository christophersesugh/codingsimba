import { readMdxDirectory } from "~/utils/misc.server";

export async function getRoadmapData() {
  try {
    const roadmapData = await readMdxDirectory("roadmap");

    // Sort by start date
    const sortedData = roadmapData
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null && item.frontmatter?.startDate,
      )
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter.startDate);
        const dateB = new Date(b.frontmatter.startDate);
        return dateA.getTime() - dateB.getTime();
      });

    return sortedData;
  } catch (error) {
    console.error("Failed to load roadmap data:", error);
    return [];
  }
}
