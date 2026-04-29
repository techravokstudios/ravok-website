"use client";

/**
 * Site Editor (CMS MVP) — homepage copy + image swapping.
 *
 * State model: one root HomeContent in useState. Each section editor receives
 * its slice + an onChange that updates the root. Save button serializes the
 * whole content and PUTs to /api/v1/admin/site/content/home.
 */

import { useEffect, useState } from "react";
import { Loader2, Save, RotateCcw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
    DEFAULT_HOME_CONTENT,
    fetchHomeContentForAdmin,
    saveHomeContent,
    type HomeContent,
} from "@/lib/site-content";

import {
    TextField,
    TextareaField,
    ImagePicker,
    StringListField,
    SectionPanel,
    EmphasisHelp,
} from "./fields";

type Props = {
    initialContent: HomeContent;
    /** Optional callback fired after a successful save — used by the
     *  parent page to refresh the live-preview iframe. */
    onSaved?: () => void;
};

export function SiteEditorClient({ initialContent, onSaved }: Props) {
    const [content, setContent] = useState<HomeContent>(initialContent);
    const [savedContent, setSavedContent] = useState<HomeContent>(initialContent);
    const [saving, setSaving] = useState(false);
    const [reloading, setReloading] = useState(false);

    const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

    // Refresh from server (in case someone else edited)
    async function reload() {
        setReloading(true);
        try {
            const fresh = await fetchHomeContentForAdmin();
            setContent(fresh);
            setSavedContent(fresh);
            toast.success("Reloaded latest content from server");
        } catch (err) {
            toast.error("Reload failed: " + (err instanceof Error ? err.message : "unknown error"));
        } finally {
            setReloading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const persisted = await saveHomeContent(content);
            setSavedContent(persisted);
            setContent(persisted);
            toast.success("Saved. Changes are live on the homepage.");
            onSaved?.();
        } catch (err) {
            toast.error("Save failed: " + (err instanceof Error ? err.message : "unknown error"));
        } finally {
            setSaving(false);
        }
    }

    function resetToDefaults() {
        if (!confirm("Reset all homepage content to the original defaults? This won't save until you click Save.")) return;
        setContent(DEFAULT_HOME_CONTENT);
        toast.info("Reset to defaults — click Save to persist.");
    }

    // Warn on close if dirty
    useEffect(() => {
        function beforeUnload(e: BeforeUnloadEvent) {
            if (dirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        }
        window.addEventListener("beforeunload", beforeUnload);
        return () => window.removeEventListener("beforeunload", beforeUnload);
    }, [dirty]);

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Sticky toolbar */}
            <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-black/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-white/50">Editing</span>
                    <span className="font-heading text-[1rem] text-white">/ (homepage)</span>
                    {dirty && (
                        <span className="text-[0.62rem] tracking-[0.2em] uppercase text-ravok-gold font-semibold ml-2">
                            ● Unsaved
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] tracking-[0.15em] uppercase text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View live
                    </a>
                    <button
                        onClick={reload}
                        disabled={reloading || saving}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] tracking-[0.15em] uppercase text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition-colors disabled:opacity-40"
                    >
                        {reloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        Reload
                    </button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || !dirty}
                        className="inline-flex items-center gap-1.5"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving…" : "Save"}
                    </Button>
                </div>
            </div>

            <HeroEditor
                value={content.hero}
                onChange={(hero) => setContent({ ...content, hero })}
            />
            <IntroEditor
                value={content.intro}
                onChange={(intro) => setContent({ ...content, intro })}
            />
            <BridgeEditor
                value={content.bridge}
                onChange={(bridge) => setContent({ ...content, bridge })}
            />
            <PortfolioEditor
                value={content.portfolio}
                onChange={(portfolio) => setContent({ ...content, portfolio })}
            />
            <TeamEditor
                value={content.team}
                onChange={(team) => setContent({ ...content, team })}
            />
            <FooterEditor
                value={content.footer}
                onChange={(footer) => setContent({ ...content, footer })}
            />

            <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                <button
                    onClick={resetToDefaults}
                    className="text-[0.7rem] tracking-[0.15em] uppercase text-white/40 hover:text-red-400 transition-colors"
                >
                    Reset to defaults
                </button>
                <Button
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="inline-flex items-center gap-1.5"
                >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? "Saving…" : "Save"}
                </Button>
            </div>
        </div>
    );
}

/* ─────────── Per-section editors ─────────── */

function HeroEditor({ value, onChange }: { value: HomeContent["hero"]; onChange: (v: HomeContent["hero"]) => void }) {
    return (
        <SectionPanel title="Hero" description="The opening section: logo, tagline, scroll cue.">
            <TextField
                label="Tagline"
                value={value.tagline}
                onChange={(tagline) => onChange({ ...value, tagline })}
            />
            <TextField
                label="Scroll cue text"
                value={value.scrollCue}
                onChange={(scrollCue) => onChange({ ...value, scrollCue })}
            />
            <ImagePicker
                label="Logo image"
                value={value.logoImage}
                onChange={(logoImage) => onChange({ ...value, logoImage })}
            />
            <ImagePicker
                label="Background temple image"
                value={value.templeImage}
                onChange={(templeImage) => onChange({ ...value, templeImage })}
            />
        </SectionPanel>
    );
}

function IntroEditor({
    value,
    onChange,
}: {
    value: HomeContent["intro"];
    onChange: (v: HomeContent["intro"]) => void;
}) {
    return (
        <SectionPanel title="Intro / About" description="Hook headline + body paragraphs + facts list + CTAs + statue.">
            <TextField label="Eyebrow" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
            <TextField
                label="Headline"
                value={value.headline}
                onChange={(headline) => onChange({ ...value, headline })}
                help="Use **phrase** for gold-italic emphasis."
            />
            <TextareaField
                label="Body paragraph 1"
                value={value.body1}
                onChange={(body1) => onChange({ ...value, body1 })}
                rows={4}
            />
            <TextareaField
                label="Body paragraph 2"
                value={value.body2}
                onChange={(body2) => onChange({ ...value, body2 })}
                rows={5}
            />
            <EmphasisHelp />
            <StringListField
                label="Facts list (gold checkmarks)"
                value={value.facts}
                onChange={(facts) => onChange({ ...value, facts })}
                addLabel="Add fact"
                placeholder="e.g., 2 films incorporated as SPVs"
            />
            <CtasEditor
                ctas={value.ctas}
                onChange={(ctas) => onChange({ ...value, ctas })}
            />
            <ImagePicker
                label="Statue image (right column)"
                value={value.statueImage}
                onChange={(statueImage) => onChange({ ...value, statueImage })}
            />
        </SectionPanel>
    );
}

function CtasEditor({
    ctas,
    onChange,
}: {
    ctas: HomeContent["intro"]["ctas"];
    onChange: (v: HomeContent["intro"]["ctas"]) => void;
}) {
    function update(i: number, patch: Partial<HomeContent["intro"]["ctas"][number]>) {
        const next = ctas.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
        onChange(next);
    }
    function add() {
        onChange([...ctas, { label: "Learn more", href: "#", variant: "secondary" }]);
    }
    function remove(i: number) {
        onChange(ctas.filter((_, idx) => idx !== i));
    }

    return (
        <div>
            <label className="block font-sans text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-white/60 mb-1.5">
                CTAs
            </label>
            <div className="space-y-3">
                {ctas.map((cta, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
                        <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                            placeholder="Label"
                            value={cta.label}
                            onChange={(e) => update(i, { label: e.target.value })}
                        />
                        <input
                            type="text"
                            className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white font-mono text-[0.8rem]"
                            placeholder="/path or #anchor"
                            value={cta.href}
                            onChange={(e) => update(i, { href: e.target.value })}
                        />
                        <select
                            className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                            value={cta.variant}
                            onChange={(e) =>
                                update(i, { variant: e.target.value as HomeContent["intro"]["ctas"][number]["variant"] })
                            }
                        >
                            <option value="primary">primary</option>
                            <option value="secondary">secondary</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="h-9 px-3 rounded-md border border-white/10 hover:border-red-500/40 hover:text-red-400 text-white/50 text-xs"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={add}
                    className="text-[0.7rem] tracking-[0.15em] uppercase text-ravok-gold/80 hover:text-ravok-gold font-semibold px-3 py-1.5 border border-ravok-gold/30 hover:border-ravok-gold/60 rounded-md transition-colors"
                >
                    + Add CTA
                </button>
            </div>
        </div>
    );
}

function BridgeEditor({
    value,
    onChange,
}: {
    value: HomeContent["bridge"];
    onChange: (v: HomeContent["bridge"]) => void;
}) {
    function updateRow(i: number, patch: Partial<HomeContent["bridge"]["rows"][number]>) {
        const next = value.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
        onChange({ ...value, rows: next });
    }
    function addRow() {
        onChange({ ...value, rows: [...value.rows, { dim: "", old: "", next: "" }] });
    }
    function removeRow(i: number) {
        onChange({ ...value, rows: value.rows.filter((_, idx) => idx !== i) });
    }

    return (
        <SectionPanel title="Bridge / REITs" description="The Pattern: REITs analogy + Hollywood-vs-RAVOK comparison table.">
            <TextField label="Eyebrow" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
            <TextareaField
                label="Headline"
                value={value.headline}
                onChange={(headline) => onChange({ ...value, headline })}
                rows={2}
                help="Use \\n for line breaks. Use **phrase** for gold-italic emphasis."
            />
            <TextareaField
                label="Lead paragraph"
                value={value.lead}
                onChange={(lead) => onChange({ ...value, lead })}
                rows={3}
            />
            <EmphasisHelp />
            <div className="grid grid-cols-2 gap-3">
                <TextField
                    label="Old column label"
                    value={value.columnOldLabel}
                    onChange={(columnOldLabel) => onChange({ ...value, columnOldLabel })}
                />
                <TextField
                    label="New column label"
                    value={value.columnNewLabel}
                    onChange={(columnNewLabel) => onChange({ ...value, columnNewLabel })}
                />
            </div>

            <div>
                <label className="block font-sans text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-white/60 mb-1.5">
                    Comparison rows
                </label>
                <div className="space-y-3">
                    {value.rows.map((row, i) => (
                        <div key={i} className="border border-white/10 rounded-md p-3 space-y-2 bg-white/[0.02]">
                            <div className="flex items-start justify-between gap-2">
                                <input
                                    type="text"
                                    className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white font-heading italic w-full"
                                    placeholder="Dimension (e.g., Cap table)"
                                    value={row.dim}
                                    onChange={(e) => updateRow(i, { dim: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeRow(i)}
                                    className="h-9 px-3 rounded-md border border-white/10 hover:border-red-500/40 hover:text-red-400 text-white/50 text-xs flex-shrink-0"
                                >
                                    Remove row
                                </button>
                            </div>
                            <textarea
                                className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-[0.85rem] text-white w-full resize-y"
                                rows={2}
                                placeholder="Old (Hollywood) cell"
                                value={row.old}
                                onChange={(e) => updateRow(i, { old: e.target.value })}
                            />
                            <textarea
                                className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-[0.85rem] text-white w-full resize-y"
                                rows={2}
                                placeholder="New (RAVOK) cell — supports **emphasis**"
                                value={row.next}
                                onChange={(e) => updateRow(i, { next: e.target.value })}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addRow}
                        className="text-[0.7rem] tracking-[0.15em] uppercase text-ravok-gold/80 hover:text-ravok-gold font-semibold px-3 py-1.5 border border-ravok-gold/30 hover:border-ravok-gold/60 rounded-md transition-colors"
                    >
                        + Add row
                    </button>
                </div>
            </div>

            <ImagePicker
                label="Statue image (left column)"
                value={value.statueImage}
                onChange={(statueImage) => onChange({ ...value, statueImage })}
            />
        </SectionPanel>
    );
}

function PortfolioEditor({
    value,
    onChange,
}: {
    value: HomeContent["portfolio"];
    onChange: (v: HomeContent["portfolio"]) => void;
}) {
    function updateStep(i: number, patch: Partial<HomeContent["portfolio"]["steps"][number]>) {
        const next = value.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
        onChange({ ...value, steps: next });
    }

    return (
        <SectionPanel title="Portfolio" description="4-pillar scrollytell: each step has tag, name, title, body, meta bullets, chip, badge.">
            <TextField label="Section label (eyebrow)" value={value.label} onChange={(label) => onChange({ ...value, label })} />
            <TextField label="Counter suffix (top-right)" value={value.counterSuffix} onChange={(counterSuffix) => onChange({ ...value, counterSuffix })} />

            <div className="space-y-4">
                {value.steps.map((step, i) => (
                    <div key={i} className="border border-white/10 rounded-md p-4 space-y-3 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="font-heading italic text-ravok-gold">
                                {step.badgeNum} · {step.name || "(unnamed)"}
                            </div>
                            <label className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em] text-white/50">
                                <input
                                    type="checkbox"
                                    checked={step.comingSoon}
                                    onChange={(e) => updateStep(i, { comingSoon: e.target.checked })}
                                />
                                Coming soon mode
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="Tag" value={step.tag} onChange={(tag) => updateStep(i, { tag })} />
                            <TextField label="Name" value={step.name} onChange={(name) => updateStep(i, { name })} />
                            <TextField label="Badge num" value={step.badgeNum} onChange={(badgeNum) => updateStep(i, { badgeNum })} />
                            <TextField label="Badge label" value={step.badgeLabel} onChange={(badgeLabel) => updateStep(i, { badgeLabel })} />
                        </div>
                        <TextField
                            label="Title (heading sentence)"
                            value={step.title}
                            onChange={(title) => updateStep(i, { title })}
                            help="**phrase** for gold-italic emphasis"
                        />
                        {!step.comingSoon && (
                            <>
                                <TextareaField
                                    label="Body"
                                    value={step.body}
                                    onChange={(body) => updateStep(i, { body })}
                                    rows={3}
                                />
                                <StringListField
                                    label="Meta bullets"
                                    value={step.meta}
                                    onChange={(meta) => updateStep(i, { meta })}
                                    addLabel="Add bullet"
                                    placeholder="**2** films incorporated"
                                />
                            </>
                        )}
                        <TextField label="Chip" value={step.chip} onChange={(chip) => updateStep(i, { chip })} />
                    </div>
                ))}
            </div>
        </SectionPanel>
    );
}

function TeamEditor({
    value,
    onChange,
}: {
    value: HomeContent["team"];
    onChange: (v: HomeContent["team"]) => void;
}) {
    function updateMember(i: number, patch: Partial<HomeContent["team"]["members"][number]>) {
        const next = value.members.map((m, idx) => (idx === i ? { ...m, ...patch } : m));
        onChange({ ...value, members: next });
    }
    function addMember() {
        onChange({
            ...value,
            members: [
                ...value.members,
                { name: "", role: "", bio: "", photo: "", linkedin: "" },
            ],
        });
    }
    function removeMember(i: number) {
        onChange({ ...value, members: value.members.filter((_, idx) => idx !== i) });
    }

    return (
        <SectionPanel title="Team" description="Coin marquee header + member cards. Linkedin links optional.">
            <TextField label="Eyebrow" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
            <TextField
                label="Headline"
                value={value.headline}
                onChange={(headline) => onChange({ ...value, headline })}
                help="**phrase** for gold-italic emphasis"
            />
            <TextareaField
                label="Lead paragraph"
                value={value.lead}
                onChange={(lead) => onChange({ ...value, lead })}
                rows={2}
            />
            <ImagePicker
                label="Coin frame SVG"
                value={value.coinFrame}
                onChange={(coinFrame) => onChange({ ...value, coinFrame })}
            />
            <div className="space-y-3">
                {value.members.map((m, i) => (
                    <div key={i} className="border border-white/10 rounded-md p-4 space-y-3 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="font-heading italic text-ravok-gold">{m.name || "(unnamed)"}</div>
                            <button
                                type="button"
                                onClick={() => removeMember(i)}
                                className="text-xs text-white/40 hover:text-red-400"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="Name" value={m.name} onChange={(name) => updateMember(i, { name })} />
                            <TextField label="Role" value={m.role} onChange={(role) => updateMember(i, { role })} />
                        </div>
                        <TextareaField label="Bio" value={m.bio} onChange={(bio) => updateMember(i, { bio })} rows={3} />
                        <ImagePicker
                            label="Photo"
                            value={m.photo}
                            onChange={(photo) => updateMember(i, { photo })}
                        />
                        <TextField
                            label="LinkedIn URL (optional)"
                            value={m.linkedin}
                            onChange={(linkedin) => updateMember(i, { linkedin })}
                            placeholder="https://www.linkedin.com/in/..."
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addMember}
                    className="text-[0.7rem] tracking-[0.15em] uppercase text-ravok-gold/80 hover:text-ravok-gold font-semibold px-3 py-1.5 border border-ravok-gold/30 hover:border-ravok-gold/60 rounded-md transition-colors"
                >
                    + Add team member
                </button>
            </div>
        </SectionPanel>
    );
}

function FooterEditor({
    value,
    onChange,
}: {
    value: HomeContent["footer"];
    onChange: (v: HomeContent["footer"]) => void;
}) {
    function updateLink(i: number, patch: Partial<HomeContent["footer"]["links"][number]>) {
        const next = value.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
        onChange({ ...value, links: next });
    }
    function addLink() {
        onChange({ ...value, links: [...value.links, { label: "", href: "" }] });
    }
    function removeLink(i: number) {
        onChange({ ...value, links: value.links.filter((_, idx) => idx !== i) });
    }

    return (
        <SectionPanel title="Footer" description="Email, logo text, links, copyright line.">
            <div className="grid grid-cols-2 gap-3">
                <TextField
                    label="Contact email"
                    value={value.email}
                    onChange={(email) => onChange({ ...value, email })}
                />
                <TextField
                    label="Logo text"
                    value={value.logoText}
                    onChange={(logoText) => onChange({ ...value, logoText })}
                />
            </div>
            <TextField
                label="Copyright"
                value={value.copyright}
                onChange={(copyright) => onChange({ ...value, copyright })}
            />
            <div>
                <label className="block font-sans text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-white/60 mb-1.5">
                    Links
                </label>
                <div className="space-y-2">
                    {value.links.map((l, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                            <input
                                type="text"
                                className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                                placeholder="Label"
                                value={l.label}
                                onChange={(e) => updateLink(i, { label: e.target.value })}
                            />
                            <input
                                type="text"
                                className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white font-mono text-[0.8rem]"
                                placeholder="/path"
                                value={l.href}
                                onChange={(e) => updateLink(i, { href: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => removeLink(i)}
                                className="h-9 px-3 rounded-md border border-white/10 hover:border-red-500/40 hover:text-red-400 text-white/50 text-xs"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLink}
                        className="text-[0.7rem] tracking-[0.15em] uppercase text-ravok-gold/80 hover:text-ravok-gold font-semibold px-3 py-1.5 border border-ravok-gold/30 hover:border-ravok-gold/60 rounded-md transition-colors"
                    >
                        + Add link
                    </button>
                </div>
            </div>
        </SectionPanel>
    );
}
