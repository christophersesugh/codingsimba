import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

type EmailChangeNotificationProps = {
  name: string;
  newEmail: string;
  oldEmail: string;
  changeDate: string;
  ipAddress: string;
  supportUrl?: string;
};

export const EmailChangeNotification = ({
  supportUrl = "https://codingsimba.com/contact",
  ipAddress = "127.0.0.1",
  ...props
}: EmailChangeNotificationProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-black py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-[#151516] px-[32px] py-[40px]">
            <Section>
              <Heading className="mb-[24px] text-center text-[28px] font-bold text-white">
                Email Address Changed
              </Heading>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-300">
                Hello {props.name},
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-300">
                We&apos;re writing to confirm that your email address has been
                successfully changed on your account.
              </Text>

              <Section className="mb-[24px] rounded-[8px] border border-solid border-gray-700 bg-[#1f1f23] p-[24px]">
                <Text className="m-0 mb-[8px] text-[14px] text-gray-400">
                  Previous Email:
                </Text>
                <Text className="m-0 mb-[16px] text-[16px] font-medium text-white">
                  {props.oldEmail}
                </Text>

                <Text className="m-0 mb-[8px] text-[14px] text-gray-400">
                  New Email:
                </Text>
                <Text className="m-0 text-[16px] font-medium text-white">
                  {props.newEmail}
                </Text>
              </Section>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-300">
                This change was made on {props.changeDate} from IP address{" "}
                {ipAddress}.
              </Text>

              <Section className="mb-[24px] rounded-[8px] border border-solid border-red-800 bg-[#2d1b1b] p-[24px]">
                <Text className="m-0 mb-[16px] text-[16px] font-medium text-red-400">
                  ⚠️ If you didn&apos;t make this change
                </Text>
                <Text className="m-0 mb-[16px] text-[14px] leading-[20px] text-gray-300">
                  If you did not request this email change, your account may
                  have been compromised. Please take immediate action to secure
                  your account.
                </Text>
                <Button
                  href={supportUrl}
                  className="mt-2 box-border rounded-[6px] bg-red-600 px-[24px] py-[12px] text-[14px] font-medium text-white no-underline"
                >
                  Secure My Account
                </Button>
              </Section>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-300">
                From now on, all account notifications and communications will
                be sent to your new email address. Make sure you have access to{" "}
                {props.newEmail} to receive important updates.
              </Text>

              <Text className="mb-[32px] text-[16px] leading-[24px] text-gray-300">
                If you have any questions or need assistance, please don&apos;t
                hesitate to contact our support team.
              </Text>

              <Button
                href={supportUrl}
                className="box-border rounded-[6px] bg-white px-[32px] py-[14px] text-[16px] font-medium text-black no-underline"
              >
                Contact Support
              </Button>
            </Section>

            <Hr className="my-[32px] border-gray-700" />

            <Section>
              <Text className="m-0 mt-[16px] text-[12px] text-gray-500">
                © 2025 - present Coding Simba. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
