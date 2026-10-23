import { Faq, Hero, HowItWorks, ResultCard, ResultSkeleton } from "./blocks";
import { mockVideo } from "@/lib/mock-video";
import { ResultError } from "./blocks/result/result-error";

export const Home = () => {
  return (
    <main>
      <Hero />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 pb-12">
        <ResultSkeleton />
        <ResultError />
        <ResultCard video={mockVideo} />
      </div>
      <HowItWorks />
      <Faq />
    </main>
  );
};
