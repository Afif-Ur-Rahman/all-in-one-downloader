import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    heading: "Acceptance of terms",
    body: [
      `By using ${siteConfig.name} you agree to these terms. If you do not agree, please do not use the service.`,
    ],
  },
  {
    heading: "What the service does",
    body: [
      "The service lets you paste a link to a publicly available video and download a copy of it to your own device. We do not host the videos. We retrieve them from the original platform at your request.",
    ],
  },
  {
    heading: "Your responsibilities",
    body: [
      "You may only download content that you own, that is in the public domain, or that you have permission from the rights holder to save.",
      "You are responsible for how you use the files you download, including complying with copyright law, the terms of the original platform, and the laws of your country.",
    ],
  },
  {
    heading: "Prohibited use",
    body: [
      "You may not use the service to infringe copyright or other rights, to download private content you are not authorized to access, to overload or disrupt the service with automated requests, or to attempt to bypass any limits we put in place.",
    ],
  },
  {
    heading: "Third-party platforms",
    body: [
      `${siteConfig.name} is not affiliated with, endorsed by, or sponsored by YouTube, TikTok, Instagram, Facebook, X, Vimeo, Reddit, or any other platform. All trademarks and logos belong to their respective owners.`,
    ],
  },
  {
    heading: "Availability and changes",
    body: [
      "The service is provided as is, and we do not guarantee that it will always be available, error-free, or able to download from every platform. We may change or stop parts of the service at any time.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, we are not liable for any loss or damage that results from your use of the service or from content you download.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about these terms can be sent to ${siteConfig.contactEmail}.`,
    ],
  },
];

const TermsPage = () => {
  return (
    <LegalPage
      title="Terms of Use"
      lastUpdated="October 23, 2026"
      intro="Please read these terms carefully before using the service. They explain what you can expect from us and what we expect from you."
      sections={sections}
    />
  );
};

export default TermsPage;
