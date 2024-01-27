import type { MetaFunction } from "@remix-run/node";
import { HiOutlineMailOpen } from "react-icons/hi";
import { MdShareLocation } from "react-icons/md";
import { Container } from "~/components/container";
import { metaFn } from "~/utils/meta";

export const meta: MetaFunction = metaFn;

export default function Contact() {
  return (
    <Container>
      <h2 className="text-2xl text-slate-800 dark:text-slate-100 my-6">
        Contact CS.
      </h2>
      <div className="">
        <div className="mb-4">
          Thank you for visiting my website. If you have any questions or would
          like to get in touch, please feel free to send me a mail.
          <div className="my-8 text-lg bg-slate-100 rounded-md p-8 text-blue-900">
            <div className="mb-4">
              <MdShareLocation className="text-2xl inline mr-4" />
              Nigeria
            </div>
            <span>
              <HiOutlineMailOpen className="text-2xl inline mr-4" />{" "}
              <a href="mailto:codingsimba@gmail.com" className="underline">
                codingsimba@gmail.com.
              </a>
            </span>
          </div>
        </div>
        <p className="mb-4">
          I will do my best to respond to your email as soon as possible.
        </p>
        <p className="mb-4">
          Thank you for your interest.
          <br /> Best regards,
          <br />
          Christopher A. Sesugh
        </p>
      </div>
    </Container>
  );
}
