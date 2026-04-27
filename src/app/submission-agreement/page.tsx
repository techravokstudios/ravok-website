"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, FileText } from "lucide-react";

const TOTAL_SECTIONS = 14;

function Section({
  num,
  title,
  children,
  delay = 0,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      id={`section-${num}`}
      className="scroll-mt-32 pl-6 lg:pl-8 border-l-2 border-ravok-gold/30 hover:border-ravok-gold/50 transition-colors duration-300 py-2"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="w-10 h-10 rounded-full border-2 border-ravok-gold flex items-center justify-center font-heading text-ravok-gold text-sm font-bold shrink-0">
          {num}
        </span>
        <h2 className="text-xl font-heading text-ravok-gold">{title}</h2>
      </div>
      <div className="font-sans text-white/85 leading-relaxed space-y-4">{children}</div>
    </motion.div>
  );
}

export default function SubmissionAgreementPage() {
  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Hero header */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-ravok-gold/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-0 w-40 h-px bg-gradient-to-r from-ravok-gold/40 to-transparent" />
          <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-ravok-gold/30 to-transparent" />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </Link>
          </motion.div>

          <motion.div
            className="flex items-start gap-5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FileText className="w-10 h-10 text-ravok-gold shrink-0 mt-1" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-heading font-normal text-ravok-gold leading-tight">
                Script Submission Terms &amp; Conditions
              </h1>
              <p className="font-sans text-sm text-ravok-slate mt-3">
                Last Updated April 1, 2026
              </p>
            </div>
          </motion.div>

          <motion.p
            className="font-sans text-sm text-white/70 leading-relaxed max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Please read these terms and conditions carefully before submitting any material. By submitting a script, treatment, synopsis, or any related material (collectively, &ldquo;Submission&rdquo;) through this website, you (&ldquo;Submitter&rdquo;) acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree, do not submit any material.
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section className="px-6 pb-24">
        <div className="container mx-auto max-w-4xl space-y-16">

          <Section num={1} title="Eligibility">
            <p>The Submitter must be at least 18 years of age and legally authorized to enter into a binding agreement. By making a Submission, you represent and warrant that you meet these requirements.</p>
          </Section>

          <Section num={2} title="Unsolicited Material Acknowledgment">
            <p>The Submitter acknowledges that Ravok Studios receives numerous script submissions and that ideas, themes, story elements, and concepts contained within the Submission may be similar to material already under development, previously received from other sources, or independently created by Ravok Studios or its affiliates. The Submitter agrees that no confidential or fiduciary relationship is established between the Submitter and Ravok Studios by virtue of this Submission.</p>
          </Section>

          <Section num={3} title="Ownership and Originality">
            <p>The Submitter represents and warrants that:</p>
            <p>(a) The Submission is the Submitter&rsquo;s original work, or the Submitter has obtained all necessary rights, permissions, and licenses to submit the material and to grant the rights described herein.</p>
            <p>(b) The Submission does not infringe upon or violate any copyright, trademark, right of privacy, right of publicity, or any other intellectual property or proprietary right of any third party.</p>
            <p>(c) The Submission does not contain any defamatory, libelous, obscene, or otherwise unlawful content.</p>
            <p>(d) No prior agreement, obligation, or encumbrance exists that conflicts with the rights granted herein.</p>
            <p>(e) If the Submission is based upon, adapted from, or derived from any pre-existing work, including but not limited to published or unpublished literary works, life stories, or other intellectual property, the Submitter has obtained all necessary rights to such underlying material and is authorized to grant the rights described herein.</p>
          </Section>

          <Section num={4} title="Limited License to Review">
            <p>By submitting material, the Submitter grants Ravok Studios a non-exclusive, royalty-free, worldwide license to read, evaluate, analyze (including through automated or AI-assisted means), and internally discuss the Submission for the purpose of determining its suitability for development or production.</p>
          </Section>

          <Section num={5} title="No Obligation">
            <p>Ravok Studios is under no obligation to:</p>
            <p>(a) Review, respond to, or acknowledge receipt of any Submission.</p>
            <p>(b) Develop, produce, or otherwise use any Submission.</p>
            <p>(c) Return any submitted material to the Submitter.</p>
            <p>(d) Enter into any agreement with the Submitter regarding the Submission.</p>
            <p>Ravok Studios reserves the sole and absolute discretion to accept or reject any Submission for any reason or no reason at all.</p>
          </Section>

          <Section num={6} title="Compensation">
            <p>No compensation, payment, credit, or other consideration is owed to the Submitter for the act of submitting material or for Ravok Studios&rsquo; review thereof. If Ravok Studios elects to proceed with development or production of a Submission, any compensation or credit shall be subject to a separate written agreement negotiated between the parties.</p>
          </Section>

          <Section num={7} title="Data Collection and Use">
            <p className="font-bold text-white/90">7.1 Personal Information</p>
            <p>In connection with the Submission, Ravok Studios may collect personal information including, but not limited to, the Submitter&rsquo;s name, email address, phone number, mailing address, professional biography, and any other information provided through the submission form. This information will be processed in accordance with Ravok Studios&rsquo; Privacy Policy.</p>

            <p className="font-bold text-white/90 mt-6">7.2 Use of Submission Data in Connection with Proprietary AI-Assisted Analysis</p>
            <p>By submitting material through this website, the Submitter acknowledges and agrees that Ravok Studios utilizes a proprietary AI-powered analytical framework in connection with the evaluation and development of submitted material. The Submitter consents to the following uses of the Submission:</p>
            <p>(a) <strong>Analytical Processing.</strong> The Submission may be processed by Ravok Studios&rsquo; proprietary systems and by third-party artificial intelligence services, including large language models, for the purpose of script analysis, market assessment, audience evaluation, concept validation, financial modeling, and other analytical functions related to the evaluation of the Submission&rsquo;s viability for development or production.</p>
            <p>(b) <strong>Data Retention and Contextual Learning.</strong> Ravok Studios may retain Submission data, including analytical results, metadata, and project-level context derived from the Submission, within its proprietary systems to improve the accuracy, relevance, and depth of its analytical capabilities over time.</p>
            <p>(c) <strong>Anonymized and Aggregated Insights.</strong> Ravok Studios may derive anonymized, aggregated, or statistical insights from Submissions for the purpose of improving its proprietary analytical models, benchmarking tools, market databases, and platform functionality. Such derived data shall not identify the Submitter or the specific content of any individual Submission.</p>
            <p>The Submitter acknowledges that AI-assisted analysis is one component of Ravok Studios&rsquo; evaluation process and that all development and production decisions are made at Ravok Studios&rsquo; sole discretion. The Submitter waives any right to additional compensation, notification, or approval in connection with the uses described in this Section 7.2.</p>

            <p className="font-bold text-white/90 mt-6">7.3 Data Retention</p>
            <p>Ravok Studios reserves the right to retain Submission data and associated personal information for as long as reasonably necessary to fulfill the evaluation and analytical purposes described herein, or as required by applicable law. Anonymized or aggregated data derived from Submissions pursuant to Section 7.2(c) may be retained indefinitely.</p>
          </Section>

          <Section num={8} title="Indemnification">
            <p>The Submitter agrees to indemnify, defend, and hold harmless Ravok Studios, its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, demands, liabilities, losses, damages, costs, and expenses (including reasonable attorneys&rsquo; fees) arising out of or in connection with:</p>
            <p>(a) Any breach of the Submitter&rsquo;s representations, warranties, or obligations under these Terms.</p>
            <p>(b) Any claim that the Submission infringes or misappropriates any intellectual property or other rights of any third party.</p>
            <p>(c) Any dispute between the Submitter and any third party relating to the Submission.</p>
          </Section>

          <Section num={9} title="Limitation of Liability">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RAVOK STUDIOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR OPPORTUNITIES, ARISING OUT OF OR RELATED TO THESE TERMS OR ANY SUBMISSION, REGARDLESS OF THE THEORY OF LIABILITY.</p>
          </Section>

          <Section num={10} title="No Waiver of Rights">
            <p>The Submitter retains ownership of the Submission. Nothing in these Terms shall be construed as an assignment of copyright or other ownership rights, except as expressly stated herein. However, the Submitter acknowledges that the licenses and consents granted under these Terms are irrevocable with respect to any use that has already occurred.</p>
          </Section>

          <Section num={11} title="Modification of Terms">
            <p>Ravok Studios reserves the right to modify these Terms and Conditions at any time without prior notice. Any modifications will be effective upon posting to the website. Continued submission of material following the posting of updated Terms constitutes acceptance of such changes.</p>
          </Section>

          <Section num={12} title="Governing Law and Dispute Resolution">
            <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles, except to the extent that the internal affairs, corporate governance, or entity-level obligations of Ravok Studios are governed by the laws of the State of Delaware. Any dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Los Angeles County, California. The Submitter irrevocably consents to personal jurisdiction in such courts and waives any objection to venue, including on the basis of inconvenient forum.</p>
          </Section>

          <Section num={13} title="Severability">
            <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.</p>
          </Section>

          <Section num={14} title="Entire Agreement">
            <p>These Terms and Conditions constitute the entire agreement between the Submitter and Ravok Studios with respect to the submission of material and supersede all prior or contemporaneous communications, representations, or agreements, whether written or oral.</p>
          </Section>

        </div>
      </section>

      <Footer />
    </main>
  );
}
