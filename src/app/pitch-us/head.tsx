const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need a finished script?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not necessarily. We accept projects at various stages—from concept to polished draft.",
      },
    },
    {
      "@type": "Question",
      name: "Do I keep ownership?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every project is structured as a co-founded venture where creators retain meaningful equity.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a submission fee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We never charge submission fees.",
      },
    },
  ],
};

export default function Head() {
  return (
    <>
      <title>Pitch Us</title>
      <meta
        name="description"
        content="Submit your script or project to RAVOK Studios. We co-found film ventures with creators and provide capital, packaging support, and transparent structures."
      />
      <link rel="canonical" href="https://www.ravok.co/pitch-us" />
      <meta property="og:title" content="Pitch Your Project to RAVOK Studios" />
      <meta
        property="og:description"
        content="For writers, directors, and producers building high-upside projects with ownership from day one."
      />
      <meta property="og:url" content="https://www.ravok.co/pitch-us" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
