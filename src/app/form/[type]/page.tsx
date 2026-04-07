"use client";

import { submitPublicForm, FormType } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { useMemo, useState } from "react";

const TERMS_TEXT = `SCRIPT SUBMISSION TERMS AND CONDITIONS
Last Updated April 1, 2026

PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE SUBMITTING ANY MATERIAL. BY SUBMITTING A SCRIPT, TREATMENT, SYNOPSIS, OR ANY RELATED MATERIAL (COLLECTIVELY, "SUBMISSION") THROUGH THIS WEBSITE, YOU ("SUBMITTER") ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS. IF YOU DO NOT AGREE, DO NOT SUBMIT ANY MATERIAL.

1. ELIGIBILITY
The Submitter must be at least 18 years of age and legally authorized to enter into a binding agreement. By making a Submission, you represent and warrant that you meet these requirements.

2. UNSOLICITED MATERIAL ACKNOWLEDGMENT
The Submitter acknowledges that Ravok Studios receives numerous script submissions and that ideas, themes, story elements, and concepts contained within the Submission may be similar to material already under development, previously received from other sources, or independently created by Ravok Studios or its affiliates. The Submitter agrees that no confidential or fiduciary relationship is established between the Submitter and Ravok Studios by virtue of this Submission.

3. OWNERSHIP AND ORIGINALITY
The Submitter represents and warrants that:
(a) The Submission is the Submitter's original work, or the Submitter has obtained all necessary rights, permissions, and licenses to submit the material and to grant the rights described herein.
(b) The Submission does not infringe upon or violate any copyright, trademark, right of privacy, right of publicity, or any other intellectual property or proprietary right of any third party.
(c) The Submission does not contain any defamatory, libelous, obscene, or otherwise unlawful content.
(d) No prior agreement, obligation, or encumbrance exists that conflicts with the rights granted herein.
(e) If the Submission is based upon, adapted from, or derived from any pre-existing work, including but not limited to published or unpublished literary works, life stories, or other intellectual property, the Submitter has obtained all necessary rights to such underlying material and is authorized to grant the rights described herein.

4. LIMITED LICENSE TO REVIEW
By submitting material, the Submitter grants Ravok Studios a non-exclusive, royalty-free, worldwide license to read, evaluate, analyze (including through automated or AI-assisted means), and internally discuss the Submission for the purpose of determining its suitability for development or production.

5. NO OBLIGATION
Ravok Studios is under no obligation to:
(a) Review, respond to, or acknowledge receipt of any Submission.
(b) Develop, produce, or otherwise use any Submission.
(c) Return any submitted material to the Submitter.
(d) Enter into any agreement with the Submitter regarding the Submission.
Ravok Studios reserves the sole and absolute discretion to accept or reject any Submission for any reason or no reason at all.

6. COMPENSATION
No compensation, payment, credit, or other consideration is owed to the Submitter for the act of submitting material or for Ravok Studios' review thereof. If Ravok Studios elects to proceed with development or production of a Submission, any compensation or credit shall be subject to a separate written agreement negotiated between the parties.

7. DATA COLLECTION AND USE

7.1 Personal Information
In connection with the Submission, Ravok Studios may collect personal information including, but not limited to, the Submitter's name, email address, phone number, mailing address, professional biography, and any other information provided through the submission form. This information will be processed in accordance with Ravok Studios' Privacy Policy.

7.2 Use of Submission Data in Connection with Proprietary AI-Assisted Analysis
By submitting material through this website, the Submitter acknowledges and agrees that Ravok Studios utilizes a proprietary AI-powered analytical framework in connection with the evaluation and development of submitted material. The Submitter consents to the following uses of the Submission:
(a) Analytical Processing. The Submission may be processed by Ravok Studios' proprietary systems and by third-party artificial intelligence services, including large language models, for the purpose of script analysis, market assessment, audience evaluation, concept validation, financial modeling, and other analytical functions related to the evaluation of the Submission's viability for development or production.
(b) Data Retention and Contextual Learning. Ravok Studios may retain Submission data, including analytical results, metadata, and project-level context derived from the Submission, within its proprietary systems to improve the accuracy, relevance, and depth of its analytical capabilities over time.
(c) Anonymized and Aggregated Insights. Ravok Studios may derive anonymized, aggregated, or statistical insights from Submissions for the purpose of improving its proprietary analytical models, benchmarking tools, market databases, and platform functionality. Such derived data shall not identify the Submitter or the specific content of any individual Submission.
The Submitter acknowledges that AI-assisted analysis is one component of Ravok Studios' evaluation process and that all development and production decisions are made at Ravok Studios' sole discretion. The Submitter waives any right to additional compensation, notification, or approval in connection with the uses described in this Section 7.2.

7.3 Data Retention
Ravok Studios reserves the right to retain Submission data and associated personal information for as long as reasonably necessary to fulfill the evaluation and analytical purposes described herein, or as required by applicable law. Anonymized or aggregated data derived from Submissions pursuant to Section 7.2(c) may be retained indefinitely.

8. INDEMNIFICATION
The Submitter agrees to indemnify, defend, and hold harmless Ravok Studios, its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, demands, liabilities, losses, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with:
(a) Any breach of the Submitter's representations, warranties, or obligations under these Terms.
(b) Any claim that the Submission infringes or misappropriates any intellectual property or other rights of any third party.
(c) Any dispute between the Submitter and any third party relating to the Submission.

9. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RAVOK STUDIOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR OPPORTUNITIES, ARISING OUT OF OR RELATED TO THESE TERMS OR ANY SUBMISSION, REGARDLESS OF THE THEORY OF LIABILITY.

10. NO WAIVER OF RIGHTS
The Submitter retains ownership of the Submission. Nothing in these Terms shall be construed as an assignment of copyright or other ownership rights, except as expressly stated herein. However, the Submitter acknowledges that the licenses and consents granted under these Terms are irrevocable with respect to any use that has already occurred.

11. MODIFICATION OF TERMS
Ravok Studios reserves the right to modify these Terms and Conditions at any time without prior notice. Any modifications will be effective upon posting to the website. Continued submission of material following the posting of updated Terms constitutes acceptance of such changes.

12. GOVERNING LAW AND DISPUTE RESOLUTION
These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles, except to the extent that the internal affairs, corporate governance, or entity-level obligations of Ravok Studios are governed by the laws of the State of Delaware. Any dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Los Angeles County, California. The Submitter irrevocably consents to personal jurisdiction in such courts and waives any objection to venue, including on the basis of inconvenient forum.

13. SEVERABILITY
If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.

14. ENTIRE AGREEMENT
These Terms and Conditions constitute the entire agreement between the Submitter and Ravok Studios with respect to the submission of material and supersede all prior or contemporaneous communications, representations, or agreements, whether written or oral.`;

const writerQuestions = [
  "What is the title of your project?",
  "Can you share the logline in 30 words or less?",
  "How many pages is your script?",
  "What genre does your script belong to?",
  "Can you list three films with similar concepts?",
  "What inspired you to start this script and how long have you been working on it?",
  "Exactly how many versions has this script been through?",
  "What is the most controversial or 'risky' element of your script?",
  "Narrative arc: How strong is this aspect of your script?",
  "Character development: How strong is this aspect of your script?",
  "Story structure: How strong is this aspect of your script?",
  "What do you feel your script needs to improve?",
  "Has this project received professional coverage or script doctoring? Please provide details.",
  "Do you personally own the IP, or is it optioned?",
  "Who do you see as your primary target audience?",
  "Why does your audience need to see this story in the next 18 months?",
  "Please share a link with a 3-Act Structure One Pager.",
  "Please share a link to the Pitch Deck.",
  "Please share your IMDB link/Linkedin/social media handles",
  "What kind of directors do you like and what's the vision you hope the person that comes in would bring to the project? tell us at least 3 directors",
];

const directorQuestions = [
  "Primary Portfolio / Director's Reel",
  "Professional Links",
  "The Superpower",
  "Budget Experience",
  "Technical Fluency",
  "Project Interest",
  "If project-specific",
  "The Dangerous Factor",
  "The Benchmark",
  "Narrative Integrity",
  "Collaborative Style",
  "Department Heads",
  "Crisis Management",
  "References",
  "Attached Talent",
  "Ideal Outcome",
  "Link to Materials",
];

const producerQuestions = [
  "Working title of the IP",
  "Logline in 30 words or less",
  "Why does the audience need to see this in the next 18 months",
  "Who is the audience, and how large is that demographic",
  "List 3 films with similar budgets/tones and their ROI data",
  "What made you interested in this particular project",
  "Is there an LLC or SPV already formed for this production",
  "Is the IP fully secured",
  "Has the script undergone professional coverage or legal vetting",
  "List any existing investors and their equity percentages",
  "Who is currently handling the bookkeeping/accounting for development spend",
  "What specific administrative or strategic resource do you lack",
  "Primary strength in production",
  "Greatest weakness in the production cycle",
  "Do you specialize in Raising Capital, Managing Capital, or Scaling Operations",
  "Discipline with paperwork, payroll, and reporting",
  "Describe a time you saved a project from total collapse",
  "Highest budget personally managed from start to finish",
  "Profitable exit details",
  "Most significant production failure and lesson",
  "List 3 strategic relationships",
  "One industry reference who can vouch for Business Integrity",
  "Floor and Ceiling budget numbers",
  "Secured hard or soft money",
  "Capital or equity you are seeking to raise",
  "Link to the Pitch Deck, Budget Top-sheet, and Production Timeline",
  "Why are you the producer who can execute this",
];

function titleForType(type: FormType) {
  if (type === "writer") return "WRITER";
  if (type === "director") return "DIRECTOR";
  return "PRODUCER";
}

function questionsForType(type: FormType) {
  if (type === "writer") return writerQuestions;
  if (type === "director") return directorQuestions;
  return producerQuestions;
}

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  const rawType = (params?.type as string | undefined)?.toLowerCase();
  const t = (rawType === "writer" || rawType === "director" || rawType === "producer" ? rawType : "writer") as FormType;
  const questions = useMemo(() => questionsForType(t), [t]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const total = questions.length + 2; // +2 for name and email
  const completed = useMemo(() => {
    let c = 0;
    if (name.trim()) c++;
    if (email.trim()) c++;
    c += answers.filter((v) => v.trim().length > 0).length;
    return c;
  }, [name, email, answers]);
  const pct = Math.round((completed / total) * 100);

  function updateAnswer(i: number, v: string) {
    setAnswers((arr) => {
      const next = arr.slice();
      next[i] = v;
      return next;
    });
  }

  function renderField(q: string, i: number) {
    if (t === "director" && q === "The Superpower") {
      return (
        <select
          id={`q_${i}`}
          value={answers[i] || ""}
          onChange={(e) => updateAnswer(i, e.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
        >
          <option value="">Select an option</option>
          <option value="Visual World-Building">Visual World-Building</option>
          <option value="Actor Performance">Actor Performance</option>
          <option value="Technical Innovation/VFX">Technical Innovation/VFX</option>
        </select>
      );
    }
    if (t === "director" && q === "Link to Materials") {
      const val = answers[i] || "";
      const parts = val.split("::");
      const sel = parts[0] || "";
      const url = parts[1] || "";
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <select
              id={`q_${i}_type`}
              value={sel}
              onChange={(e) => updateAnswer(i, `${e.target.value}::${url}`)}
              className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
            >
              <option value="">Select type</option>
              <option value="Pitch Deck">Pitch Deck</option>
              <option value="Director Lookbook">Director Lookbook</option>
              <option value="Visual Treatment">Visual Treatment</option>
            </select>
          </div>
          <div>
            <Input
              id={`q_${i}_url`}
              placeholder="Add link"
              value={url}
              onChange={(e) => updateAnswer(i, `${sel}::${e.target.value}`)}
            />
          </div>
        </div>
      );
    }
    if (t === "producer" && q === "Primary strength in production") {
      return (
        <select
          id={`q_${i}`}
          value={answers[i] || ""}
          onChange={(e) => updateAnswer(i, e.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
        >
          <option value="">Select an option</option>
          <option value="Financial Engineering">Financial Engineering</option>
          <option value="Creative Packaging">Creative Packaging</option>
          <option value="On-Set Execution">On-Set Execution</option>
        </select>
      );
    }
    if (t === "producer" && q === "Do you specialize in Raising Capital, Managing Capital, or Scaling Operations") {
      return (
        <select
          id={`q_${i}`}
          value={answers[i] || ""}
          onChange={(e) => updateAnswer(i, e.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
        >
          <option value="">Select an option</option>
          <option value="Raising Capital">Raising Capital</option>
          <option value="Managing Capital">Managing Capital</option>
          <option value="Scaling Operations">Scaling Operations</option>
        </select>
      );
    }
    return (
      <Textarea
        id={`q_${i}`}
        rows={3}
        value={answers[i] || ""}
        onChange={(e) => updateAnswer(i, e.target.value)}
      />
    );
  }

  async function submit() {
    const nm = name.trim();
    const em = email.trim();
    if (!nm || !em) {
      toast.error("Name and email are required");
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must read and agree to the Terms and Conditions before submitting");
      return;
    }
    const data: Record<string, any> = {};
    questions.forEach((q, i) => (data[q] = answers[i] || ""));
    try {
      await submitPublicForm(t, { name: nm, email: em, data });
      setName("");
      setEmail("");
      setAnswers(questions.map(() => ""));
      setAgreedToTerms(false);
      toast.success("Submitted");
      router.push("/form");
    } catch (e: any) {
      toast.error(e.message || "Submission failed");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-heading font-thin text-ravok-gold leading-tight">
              {titleForType(t)} Form
            </h1>
            <p className="mt-2 font-sans text-sm text-ravok-slate">
              Name and email are required. All other fields are optional.
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-sans text-ravok-slate mb-2">
              <span>
                {completed}/{total} completed
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
              <div
                className="h-full bg-ravok-gold"
                style={{ width: `${pct}%` }}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 shadow-lg p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-5">
              {questions.map((q, i) => (
                <div key={i} className="space-y-2">
                  <Label htmlFor={`q_${i}`}>{q}</Label>
                  {renderField(q, i)}
                </div>
              ))}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <p className="font-sans text-sm font-semibold text-ravok-gold uppercase tracking-widest">
                Script Submission Terms &amp; Conditions
              </p>
              <div
                className="h-64 overflow-y-auto rounded-lg border border-white/20 bg-black/60 p-4 font-sans text-xs text-white/60 leading-relaxed whitespace-pre-wrap"
                tabIndex={0}
                aria-label="Script Submission Terms and Conditions"
              >
                {TERMS_TEXT}
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-ravok-gold cursor-pointer"
                  aria-required="true"
                />
                <span className="font-sans text-sm text-white/80 group-hover:text-white transition-colors">
                  I have read and agree to the Script Submission Terms and Conditions, including the use of my submission data for AI-assisted analysis as described in Section 7.2.
                </span>
              </label>
            </div>

            <div>
              <Button
                onClick={submit}
                disabled={!agreedToTerms}
                className="bg-ravok-gold text-black hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit
              </Button>
              {!agreedToTerms && (
                <p className="mt-2 font-sans text-xs text-white/40">
                  You must agree to the Terms and Conditions to submit.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
