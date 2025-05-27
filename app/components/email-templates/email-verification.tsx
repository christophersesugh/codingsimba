import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
  Img,
} from "@react-email/components";

export function SignupEmail({
  code = "123456",
  onboardingUrl = "https://codingsimba.com/verify?code=123456",
}: {
  code: string;
  onboardingUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code: {code}</Preview>
      <Tailwind>
        <Body className="bg-gray-900 font-sans antialiased">
          <Container className="mx-auto my-8 max-w-[600px] rounded-lg bg-gray-800 p-6 shadow-lg shadow-black/20">
            {/* Logo/Header Section */}
            <Section className="mb-4 text-center">
              <Img
                src="https://cdn.sanity.io/media-libraries/ml4WNZcKpiTm/images/6749aa161e69b57e6d39b2cd430834da255e31bd-1024x1024.png"
                alt="Coding Simba Logo"
                className="mx-auto mb-4 size-16 object-cover"
              />
              <Heading as="h1" className="text-2xl font-bold text-white">
                Coding Simba
              </Heading>
              <Text className="mt-1 text-sm text-gray-400">
                Secure Authentication
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-2">
              <Heading
                as="h2"
                className="mb-2 text-xl font-semibold text-gray-100"
              >
                Your Verification Code
              </Heading>

              <Text className="mb-2 text-base text-gray-300">
                Please use the following code to verify your identity:
              </Text>

              {/* OTP Code Box */}
              <Section className="mb-2">
                <Container className="rounded-lg bg-gray-700 px-6 py-4 text-center ring-1 ring-gray-600">
                  <Text className="m-0 text-3xl font-bold tracking-wider text-white">
                    {code}
                  </Text>
                </Container>
                <Text className="mt-2 text-center text-xs text-gray-400">
                  Expires in 10 minutes
                </Text>
              </Section>

              {/* Verification URL */}
              <Section className="mb-6">
                <Text className="mb-2 text-sm text-gray-400">
                  Or click this link to verify:
                </Text>
                <Link
                  href={onboardingUrl}
                  className="block break-all text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {onboardingUrl}
                </Link>
              </Section>

              {/* Security Notice */}
              <Text className="text-sm text-gray-500">
                For your security, please don&apos;t share this code with
                anyone.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-700 pt-2">
              <Text className="text-xs text-gray-500">
                © 2025 CodingSimba. All rights reserved.
              </Text>
              <Text className="mt-4 text-xs text-gray-500">
                <Link
                  href="https://codingsimba.com/privacy"
                  target="_blank"
                  className="ml-2 text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                •
                <Link
                  href="https://codingsimba.com/terms"
                  target="_blank"
                  className="ml-2 text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Terms of Use
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
