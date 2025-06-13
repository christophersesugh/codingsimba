import React from "react";
import * as E from "@react-email/components";

export function Footer() {
  return (
    <E.Section className="text-center">
      <E.Text className="mb-[16px] text-[14px] leading-[20px] text-gray-400">
        Happy coding! 🦁💻
      </E.Text>
      <E.Text className="mb-[16px] text-[14px] leading-[20px] text-gray-400">
        The Coding Simba Team
      </E.Text>
      <E.Text className="m-0 text-[12px] leading-[16px] text-gray-500">
        © 2025 - now Coding Simba. All rights reserved.
      </E.Text>
      <E.Text className="mt-[8px] text-[12px] leading-[16px] text-gray-500">
        <E.Link
          href="https://codingsimba.com/unsubscribe"
          className="text-gray-500 underline"
        >
          Unsubscribe
        </E.Link>
      </E.Text>
    </E.Section>
  );
}
