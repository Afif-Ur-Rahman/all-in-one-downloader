import type { Metadata } from "next";
import { Downloads } from "@/ui";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Your recent downloads in this browser.",
  alternates: { canonical: "/downloads" },
  robots: { index: false, follow: false },
};

const DownloadsPage = () => {
  return <Downloads />;
};

export default DownloadsPage;
