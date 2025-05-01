import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";

export function SigninEmail({ signinUrl }: { signinUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your signin url: {signinUrl}</Preview>
      <Tailwind>
        <Body className="bg-[#151516] py-10 font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-[#000000] p-6">
            <Heading
              as="h1"
              className="mx-0 my-6 text-center text-2xl font-bold text-slate-400"
            >
              Coding Simba
            </Heading>
            <Heading
              as="h2"
              className="mx-0 my-6 text-center text-base font-bold text-white"
            >
              Verification Email
            </Heading>

            <Text className="mb-4 text-center text-sm leading-[20px] text-[#999999]">
              This link will expire in 10 minutes. If you didn&apos;t request
              this link, you can safely ignore this email.
            </Text>

            <Section className="mb-8">
              <Button
                href={signinUrl}
                className="box-border block rounded-[8px] bg-[#4f46e5] px-6 py-3 text-center text-base font-medium text-white no-underline"
              >
                Sign In
              </Button>
            </Section>

            <Text className="mb-4 text-center text-sm leading-[20px] text-[#999999]">
              If the button doesn&apos;t work, you can also signin by visiting
              this URL:
            </Text>

            <Text className="mb-8 break-all text-center text-sm text-[#4f46e5]">
              <Link href={signinUrl} className="text-[#4f46e5] underline">
                {signinUrl}
              </Link>
            </Text>

            <Text className="border-t border-[#333333] pt-6 text-center text-sm text-[#999999]">
              For security reasons, please do not share this link with anyone.
            </Text>

            <Text className="mb-0 mt-8 text-center text-xs text-[#777777]">
              © {new Date().getFullYear()} CodingSimba. All rights reserved.
            </Text>

            <Text className="m-0 text-center text-xs text-[#777777]">
              48D Isa Shado, Sabon Tashsa, Kaduna, Nigeria.
            </Text>

            <Text className="mb-0 mt-2 text-center text-xs text-[#777777]">
              <Link href="#" className="text-[#4f46e5] underline">
                Unsubscribe
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
