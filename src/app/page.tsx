const Home = () => {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">
        Theme check
      </h1>
      <p className="mt-4 text-muted">Body text in the muted color.</p>
      <code className="mt-4 block font-mono text-sm">
        https://example.com/video
      </code>
      <button className="mt-8 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover">
        Download
      </button>
    </main>
  );
};

export default Home;
