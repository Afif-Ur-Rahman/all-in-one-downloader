import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "DMCA & Copyright",
  description: `How to report copyright infringement on ${siteConfig.name}.`,
  alternates: { canonical: "/dmca" },
};

const sections: LegalSection[] = [
  {
    heading: "Our approach to copyright",
    body: [
      `${siteConfig.name} respects the rights of creators. We do not host videos, and we expect everyone who uses the service to follow copyright law.`,
    ],
  },
  {
    heading: "Reporting infringement",
    body: [
      `If you believe the service is being used in a way that infringes your copyright, send a written notice to ${siteConfig.contactEmail} that includes the following.`,
      "Your name and contact details, and a description of the copyrighted work you say has been infringed.",
      "The link or location of the content in question, with enough detail for us to find it.",
      "A statement that you have a good-faith belief that the use is not authorized by the copyright owner, its agent, or the law.",
      "A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act for them.",
      "Your physical or electronic signature.",
    ],
  },
  {
    heading: "What we do next",
    body: [
      "After we receive a complete notice, we will review it and take appropriate action, which may include blocking access to the content in question.",
    ],
  },
  {
    heading: "Counter-notice",
    body: [
      `If you believe a restriction was applied by mistake, you can send a counter-notice to ${siteConfig.contactEmail} explaining why. Please include your contact details and the link concerned.`,
    ],
  },
  {
    heading: "Misrepresentation",
    body: [
      "Please be accurate in any notice you send. Knowingly misrepresenting that content is infringing can have legal consequences.",
    ],
  },
];

const DmcaPage = () => {
  return (
    <LegalPage
      title="DMCA & Copyright"
      lastUpdated="October 23, 2026"
      intro="If you are a copyright owner and have a concern about how the service is being used, this page explains how to contact us."
      sections={sections}
    />
  );
};

export default DmcaPage;
