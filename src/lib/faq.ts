export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "Is it free to use?",
    answer:
      "Yes. You can paste a link and download a video without paying or creating an account.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "YouTube, TikTok, Instagram, Facebook, X (Twitter), Vimeo and Reddit are supported, and we are adding more over time.",
  },
  {
    question: "Can I choose the video quality?",
    answer:
      "Yes. After you paste a link we list the formats available for that video, so you can pick a resolution or download audio only.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. It works in your browser on desktop and mobile, with no app or extension required.",
  },
  {
    question: "Why can't I download a private video?",
    answer:
      "Private videos and videos from private accounts are not publicly accessible, so they can't be fetched from a link. Only public videos are supported.",
  },
  {
    question: "Is it legal to download videos?",
    answer:
      "It depends on the video and your country. Only download content you own, content that is in the public domain, or content you have permission to save. Respect the terms of the platform and the rights of the creator.",
  },
];
