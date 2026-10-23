import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your information.`,
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    heading: "Overview",
    body: [
      `This policy explains what information ${siteConfig.name} handles when you use the service. We keep it to the minimum needed to make the service work.`,
    ],
  },
  {
    heading: "No account required",
    body: [
      "You do not need to create an account or give us your name or email address to use the service.",
    ],
  },
  {
    heading: "Links you submit",
    body: [
      "When you paste a link, we send it to our server so we can look up the video and prepare the download. We use the link only to fulfil your request.",
    ],
  },
  {
    heading: "Technical data",
    body: [
      "Like most websites, our server and hosting provider may automatically record technical information such as your IP address, browser type, and the pages requested. This is used to keep the service secure, prevent abuse, and fix problems.",
    ],
  },
  {
    heading: "Cookies and local storage",
    body: [
      "We store your theme choice (light or dark) in your browser's local storage so the site remembers it. This information stays on your device.",
      "If we add analytics or advertising in the future, we will update this policy to describe them.",
    ],
  },
  {
    heading: "Third parties",
    body: [
      "We retrieve videos from the platforms you link to, which have their own privacy policies. Our hosting provider also processes technical data on our behalf.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can clear your browser's local storage at any time to remove the saved theme. If you have a question or request about your data, contact us at the address below.",
    ],
  },
  {
    heading: "Contact",
    body: [`You can reach us at ${siteConfig.contactEmail}.`],
  },
];

const PrivacyPage = () => {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="October 23, 2026"
      intro="We collect as little as possible. This page explains what is handled when you use the service and why."
      sections={sections}
    />
  );
};

export default PrivacyPage;
