// Example usage of Discord service for various platform events
// This file shows how to integrate Discord notifications into your application

import { discordService } from "./discord.server";

// Example: Notify when a new user signs up
export async function handleNewUserSignup(user: {
  id: string;
  username: string;
  email: string;
}) {
  try {
    await discordService.notifyNewUser({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    console.log(`Discord notification sent for new user: ${user.username}`);
  } catch (error) {
    console.error("Failed to send Discord notification for new user:", error);
  }
}

// Example: Notify when a user completes a course
export async function handleCourseCompletion(
  user: { id: string; username: string },
  courseName: string,
) {
  try {
    await discordService.notifyCourseCompletion(
      {
        id: user.id,
        username: user.username,
      },
      courseName,
      new Date(),
    );

    console.log(
      `Discord notification sent for course completion: ${courseName}`,
    );
  } catch (error) {
    console.error(
      "Failed to send Discord notification for course completion:",
      error,
    );
  }
}

// Example: Create a support ticket notification
export async function handleSupportTicket(
  user: { id: string; username: string },
  subject: string,
  priority: "low" | "medium" | "high" = "medium",
) {
  try {
    await discordService.notifySupportTicket(
      {
        id: user.id,
        username: user.username,
      },
      subject,
      priority,
    );

    console.log(`Discord notification sent for support ticket: ${subject}`);
  } catch (error) {
    console.error(
      "Failed to send Discord notification for support ticket:",
      error,
    );
  }
}

// Example: Send system notifications
export async function handleSystemEvent(
  title: string,
  message: string,
  type: "info" | "warning" | "error" = "info",
) {
  try {
    await discordService.sendSystemNotification(title, message, type);

    console.log(`Discord system notification sent: ${title}`);
  } catch (error) {
    console.error("Failed to send Discord system notification:", error);
  }
}

// Example: Integration with your existing auth system
export async function handleUserRegistration(userData: {
  id: string;
  username: string;
  email: string;
}) {
  // Your existing user registration logic
  // ...

  // Add Discord notification
  await handleNewUserSignup({
    id: userData.id,
    username: userData.username,
    email: userData.email,
  });
}

// Example: Integration with course completion
export async function handleCourseFinished(userId: string, courseId: string) {
  // Your existing course completion logic
  // ...

  // Get user and course data
  const user = await getUserById(userId);
  const course = await getCourseById(courseId);

  // Add Discord notification
  await handleCourseCompletion(
    { id: user.id, username: user.username },
    course.name,
  );
}

// Example: Integration with support system
export async function handleNewSupportRequest(
  userId: string,
  subject: string,
  description: string,
) {
  // Your existing support ticket logic
  // ...

  // Get user data
  const user = await getUserById(userId);

  // Determine priority based on keywords or user tier
  const priority = determinePriority(subject, description, user.tier);

  // Add Discord notification
  await handleSupportTicket(
    { id: user.id, username: user.username },
    subject,
    priority,
  );
}

// Helper function to determine ticket priority
function determinePriority(
  subject: string,
  description: string,
  userTier: string,
): "low" | "medium" | "high" {
  const urgentKeywords = ["urgent", "critical", "broken", "error", "crash"];
  const hasUrgentKeywords = urgentKeywords.some((keyword) =>
    (subject + description).toLowerCase().includes(keyword),
  );

  if (hasUrgentKeywords || userTier === "premium") {
    return "high";
  } else if (userTier === "basic") {
    return "medium";
  } else {
    return "low";
  }
}

// Mock functions for demonstration
async function getUserById(id: string) {
  // Your actual user fetching logic
  return { id, username: "example_user", tier: "basic" };
}

async function getCourseById(id: string) {
  // Your actual course fetching logic
  return { id, name: "Example Course" };
}
