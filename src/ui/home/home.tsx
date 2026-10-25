import { Faq, Hero, HowItWorks, Result } from "./blocks";

export const Home = () => {
  return (
    <main className="scroll-mt-16">
      <Hero />
      <Result />
      <HowItWorks />
      <Faq />
    </main>
  );
};
