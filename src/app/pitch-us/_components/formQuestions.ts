export type FieldType = "text" | "textarea" | "email" | "url" | "select" | "rating5" | "rating10" | "checkbox" | "yesno";

export interface FormQuestion {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];       // for select type
  lowLabel?: string;        // for rating type
  highLabel?: string;       // for rating type
  helperText?: string;
}

export const writerQuestions: FormQuestion[] = [
  { id: "name", label: "What's your name?", type: "text", required: true, placeholder: "Full name" },
  { id: "email", label: "What's your email for contact?", type: "email", required: true, placeholder: "you@email.com" },
  { id: "title", label: "What is the title of your project?", type: "text", required: true },
  { id: "logline", label: "Can you share the logline in 30 words or less?", type: "textarea", required: true, placeholder: "30 words max" },
  { id: "pages", label: "How many pages is your script?", type: "text", required: true },
  { id: "genre", label: "What genre does your script belong to?", type: "text", required: true },
  { id: "comps", label: "Can you list three films with similar concepts?", type: "textarea", required: true },
  { id: "inspiration", label: "What inspired you to start this script and how long have you been working on it?", type: "textarea", required: true },
  { id: "versions", label: "Exactly how many versions has this script been through?", type: "text", required: true },
  { id: "risky_element", label: "What is the most controversial or 'risky' element of your script?", type: "textarea", required: true },
  { id: "narrative_arc", label: "Narrative arc: How strong is this aspect of your script?", type: "rating5", required: true, lowLabel: "Weak", highLabel: "Exceptional" },
  { id: "character_dev", label: "Character development: How strong is this aspect of your script?", type: "rating5", required: true, lowLabel: "Weak", highLabel: "Exceptional" },
  { id: "story_structure", label: "Story structure: How strong is this aspect of your script?", type: "rating5", required: true, lowLabel: "Weak", highLabel: "Exceptional" },
  { id: "needs_improvement", label: "What do you feel your script needs to improve?", type: "textarea", required: false, helperText: "Optional" },
  { id: "coverage", label: "Has this project received professional coverage or script doctoring? Please provide details.", type: "textarea", required: true },
  { id: "ip_ownership", label: "Do you personally own the IP, or is it optioned?", type: "text", required: true },
  { id: "target_audience", label: "Who do you see as your primary target audience?", type: "textarea", required: true },
  { id: "audience_urgency", label: "Why does your audience need to see this story in the next 18 months?", type: "textarea", required: true },
  { id: "one_pager_link", label: "Please share a link with a 3-Act Structure One Pager.", type: "url", required: true, placeholder: "https://" },
  { id: "pitch_deck_link", label: "Please share a link to the Pitch Deck.", type: "url", required: true, placeholder: "https://" },
  { id: "social_links", label: "Please share your IMDB link/Linkedin/social media handles", type: "textarea", required: true },
  { id: "directors_vision", label: "What kind of directors do you like and what's the vision you hope the person that comes in would bring to the project? Tell us at least 3 directors.", type: "textarea", required: true },
  { id: "agreement", label: "Script Submission Terms and Conditions", type: "checkbox", required: true },
];

export const directorQuestions: FormQuestion[] = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Contact Email", type: "email", required: true },
  { id: "reel", label: "Primary Portfolio / Director's Reel", type: "url", required: true, placeholder: "Vimeo/YouTube preferred", helperText: "URL — Vimeo/YouTube preferred" },
  { id: "social_links", label: "Professional Links", type: "textarea", required: true, placeholder: "IMDb / LinkedIn / Instagram" },
  { id: "superpower", label: "What is your primary strength?", type: "select", required: true, options: ["Visual World-Building", "Actor Performance", "Technical Innovation/VFX"] },
  { id: "budget_experience", label: "What is the highest production budget you have personally directed and managed from prep to post?", type: "text", required: true },
  { id: "tech_fluency", label: "Rate your comfort level with virtual production, AI-assisted tools, or novel tech on a scale of 1-10.", type: "rating10", required: true, lowLabel: "Beginner", highLabel: "Expert" },
  { id: "project_interest", label: "Are you submitting for a specific script you own and submitted through the writers form, or are you looking to be matched with a Ravok internal script?", type: "textarea", required: true },
  { id: "project_specific", label: "If project-specific: What inspired this vision and how long have you been developing it?", type: "textarea", required: false, helperText: "Only if submitting a specific project" },
  { id: "dangerous_factor", label: "What is the most ambitious or 'risky' visual/tonal choice you want to make in your next project?", type: "textarea", required: true },
  { id: "benchmark_comps", label: "List 3 specific films that serve as the 'North Star' for your directorial style.", type: "textarea", required: true },
  { id: "narrative_integrity", label: "On a scale of 1-10, how much do you prioritize the script over the visual spectacle?", type: "rating10", required: true, lowLabel: "Visual first", highLabel: "Script first" },
  { id: "collaborative_style", label: "Are you a creative only, or do you understand logistics? Explain your process working with Producers.", type: "textarea", required: true },
  { id: "department_heads", label: "Do you have a 'Core Team' (DP, Editor, Production Designer) that always works with you?", type: "textarea", required: true },
  { id: "crisis_management", label: "Describe the biggest technical or creative disaster you faced on set and how you solved it.", type: "textarea", required: true },
  { id: "references", label: "List one Producer or Executive who can vouch for your ability to stay on schedule and on budget.", type: "textarea", required: true },
  { id: "attached_talent", label: "List all actors, DPs, or HODs currently attached with signed LOIs if any, or personal connections that can be a strategic fit for your projects.", type: "textarea", required: true },
  { id: "ideal_outcome", label: "What is your ideal outcome for a project (Theatrical, Streaming, etc)?", type: "text", required: true },
  { id: "materials_link", label: "Link to your latest Pitch Deck, Director Lookbook, or Visual Treatment.", type: "url", required: true, placeholder: "https://" },
  { id: "agreement", label: "Script Submission Terms and Conditions", type: "checkbox", required: true },
];

export const producerQuestions: FormQuestion[] = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Contact Email", type: "email", required: true },
  { id: "working_title", label: "Working title of the IP.", type: "text", required: true },
  { id: "logline", label: "Logline in 30 words or less.", type: "textarea", required: true, placeholder: "30 words max" },
  { id: "audience_urgency", label: "Why does the audience need to see this in the next 18 months?", type: "textarea", required: true },
  { id: "audience_demo", label: "Who is the audience, and how large is that demographic?", type: "textarea", required: true },
  { id: "comps_roi", label: "List 3 films with similar budgets/tones and their ROI data.", type: "textarea", required: true },
  { id: "interest", label: "What made you interested in this particular project?", type: "textarea", required: true },
  { id: "llc_spv", label: "Is there an LLC or SPV already formed for this production?", type: "yesno", required: true },
  { id: "ip_secured", label: "Is the IP fully secured? If optioned, provide the expiration date.", type: "textarea", required: true },
  { id: "script_coverage", label: "Has the script undergone professional coverage or legal vetting?", type: "textarea", required: true },
  { id: "existing_investors", label: "List any existing investors and their equity percentages.", type: "textarea", required: true },
  { id: "bookkeeping", label: "Who is currently handling the bookkeeping/accounting for development spend?", type: "text", required: true },
  { id: "resource_gap", label: "What specific administrative or strategic resource (beyond cash) do you lack?", type: "textarea", required: true },
  { id: "primary_strength", label: "What is your primary strength in production?", type: "select", required: true, options: ["Financial Engineering", "Creative Packaging", "On-Set Execution"] },
  { id: "greatest_weakness", label: "What is your greatest weakness in the production cycle, and who on your team covers it?", type: "textarea", required: true },
  { id: "specialization", label: "Do you specialize in:", type: "select", required: true, options: ["Raising Capital", "Managing Capital", "Scaling Operations"] },
  { id: "discipline", label: "Scale of 1-10, how disciplined are you with daily paperwork, payroll, and reporting?", type: "rating10", required: true, lowLabel: "Not at all", highLabel: "Military precision" },
  { id: "saved_project", label: "Describe a time you saved a project from total collapse. What was the specific move?", type: "textarea", required: true },
  { id: "highest_budget", label: "What is the highest budget you have personally managed from start to finish?", type: "text", required: true },
  { id: "profitable_exit", label: "Have you ever taken a project to a profitable exit? If so, where did it sell?", type: "textarea", required: true },
  { id: "biggest_failure", label: "Describe your most significant production failure. What did it cost, and what was the lesson?", type: "textarea", required: true },
  { id: "strategic_relationships", label: "List 3 strategic relationships you can call today to move the project forward.", type: "textarea", required: true },
  { id: "reference", label: "Provide one industry reference who can vouch for your 'Business Integrity.'", type: "textarea", required: true },
  { id: "budget_range", label: "Provide the 'Floor' and 'Ceiling' budget numbers.", type: "text", required: true, placeholder: "e.g. $500K — $2M" },
  { id: "secured_money", label: "How much 'hard money' (equity) or 'soft money' (tax credits) is already secured?", type: "text", required: true },
  { id: "capital_seeking", label: "Exactly how much capital/equity are you seeking to raise?", type: "text", required: true },
  { id: "materials_link", label: "Link to the Pitch Deck, Budget Top-sheet, and Production Timeline.", type: "url", required: true, placeholder: "https://" },
  { id: "why_you", label: "Why are you the producer who can execute this?", type: "textarea", required: true },
  { id: "agreement", label: "Script Submission Terms and Conditions", type: "checkbox", required: true },
];
