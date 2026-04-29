"use client";

/**
 * Team — horizontal coin marquee.
 * Content is CMS-driven and in-page editable. Per-member fields (role, name,
 * bio, photo, linkedin) are individually editable when in edit mode.
 *
 * Marquee animation pauses naturally on hover (CSS), which makes editing
 * feasible. Members are duplicated for the seamless loop; only the first set
 * is editable so admins don't accidentally try to edit a duplicate (the
 * second-set EditableTexts use the same path so changes propagate, but we
 * mark them aria-hidden + tabIndex={-1} so focus skips them).
 */

import { CRevealSection } from "@/components/design-system";
import {
    DEFAULT_HOME_CONTENT,
    type HomeContent,
    type TeamMemberContent,
} from "@/lib/site-content";
import { EditableText, EditableImage, EditableList, FloatingElementsLayer, useEditMode } from "@/lib/edit-mode";

/** The laurel ring is the actual team coin frame. */
const LAUREL_URL =
    "https://pub-0c5b0ff2bc9242ffa0b31812b16adf4e.r2.dev/2026/04/i1swh4tzrnnd.svg";
/** The legacy wireframe path that production data still points at. It's
 *  actually a 1920x810 landscape SVG — never rendered as a real frame. We
 *  treat its presence as "data not migrated yet" and substitute the laurel. */
const LEGACY_WIREFRAME_PATH = "/images/coins/coin-frame.svg";

const NEW_MEMBER_DEFAULT: TeamMemberContent = {
    name: "New Member",
    role: "Role",
    bio: "Bio…",
    photo: "/images/team/amanda.jpg",
    linkedin: "",
};

type TeamProps = {
    content?: HomeContent["team"];
};

function CoinMember({
    member,
    index,
    coinFrame,
    isDuplicate = false,
}: {
    member: TeamMemberContent;
    index: number;
    coinFrame: string;
    isDuplicate?: boolean;
}) {
    const { enabled } = useEditMode();
    const wrapperClass = "team-member flex-none w-[260px] text-center flex flex-col items-center";
    const tabIdx = isDuplicate ? -1 : undefined;

    const card = (
        <>
            <div className="coin">
                {/* Clean circular photo, no frame overlay. The "laurel" SVG
                    that was being used as a frame turned out to be the same
                    1920x810 wireframe asset Amanda found earlier — its
                    decorative content extends across the SVG canvas, so
                    rendering it on top of the photo (z-index 2 above z-index
                    1 portrait) made it visibly intrude into the photo area.
                    Removing the frame element entirely until a real ring
                    asset exists. */}
                <EditableImage
                    path={`team.members.${index}.photo`}
                    value={member.photo}
                    wrapperClassName="coin-portrait"
                >
                    {(src) => <img src={src} alt="" />}
                </EditableImage>
            </div>
            <EditableText
                path={`team.members.${index}.role`}
                value={member.role}
                as="div"
                inline={false}
                className="member-role font-sans text-[0.52rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-1"
            />
            <EditableText
                path={`team.members.${index}.name`}
                value={member.name}
                as="div"
                inline={false}
                className="member-name font-heading italic text-[1.05rem] leading-[1.15] text-[var(--ds-ink)] mb-1.5"
            />
            <EditableText
                path={`team.members.${index}.bio`}
                value={member.bio}
                as="div"
                inline={false}
                multiline
                className="member-bio font-sans text-[0.7rem] leading-[1.5] text-[var(--ds-ink-dim)] max-w-[230px] mx-auto"
            />
            {enabled && (
                <EditableText
                    path={`team.members.${index}.linkedin`}
                    value={member.linkedin}
                    as="div"
                    inline={false}
                    className="font-mono text-[0.6rem] text-[var(--ds-ink-muted)] mt-2 max-w-[230px] mx-auto"
                />
            )}
        </>
    );

    // Outside edit mode: live anchor if linkedin exists; otherwise plain div.
    if (!enabled && member.linkedin) {
        return (
            <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={wrapperClass}
                aria-hidden={isDuplicate || undefined}
                tabIndex={tabIdx}
            >
                {card}
            </a>
        );
    }

    return (
        <div className={wrapperClass} aria-hidden={isDuplicate || undefined}>
            {card}
        </div>
    );
}

export default function Team({ content }: TeamProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.team;
    const { enabled } = useEditMode();

    // Frame element removed in v28 — Amanda asked for the coin/ring to be
    // out of the photo area because the only available SVG (the "laurel"
    // that turned out to be the wireframe) had decorative content overlapping
    // the photo. Until a clean ring asset exists, photos render as plain
    // circles filling the coin.
    const effectiveCoinFrame = "";
    const frameScale = 100;
    const portraitScale = 100;

    const teamCSSVars = {
        ["--coin-frame-scale" as string]: `${frameScale}%`,
        ["--coin-portrait-scale" as string]: `${portraitScale}%`,
    } as React.CSSProperties;

    return (
        <CRevealSection zIndex={13} id="team" centerHeader={true} contentMaxWidth="1400px">
            <div style={teamCSSVars}>
            {/* Section-level layer renders ONLY section-target decorations
             *  in both edit and production. Marquee-target decorations are
             *  rendered inside team-marquee-inner (in BOTH modes — edit mode
             *  now renders the marquee structure paused) so coords match. */}
            <FloatingElementsLayer
                decorations={c.decorations ?? []}
                path="team.decorations"
                targetFilter="section"
            />
            <div className="text-center mb-6">
                <EditableText
                    path="team.eyebrow"
                    value={c.eyebrow}
                    as="p"
                    className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3"
                />
                <EditableText
                    path="team.headline"
                    value={c.headline}
                    as="h2"
                    className="font-heading font-normal text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.015em] text-[var(--ds-ink)] mb-2"
                />
                <EditableText
                    path="team.lead"
                    value={c.lead}
                    as="p"
                    multiline
                    inline={false}
                    className="font-heading italic text-[0.85rem] leading-[1.45] text-[var(--ds-ink-dim)] max-w-[520px] mx-auto"
                />
            </div>

            {enabled ? (
                /* Edit mode: wrap members in a team-coin-set sub-container so
                 * the layer covers EXACTLY 1 set's width — same coord space
                 * as each production set container. The Add button is pulled
                 * out of flex flow via CSS so it doesn't inflate the set's
                 * width. */
                <div className="team-marquee team-marquee--editing relative w-full py-2">
                    <div className="team-marquee-inner flex gap-12 w-max relative">
                        <div
                            className="team-coin-set relative flex gap-12"
                            data-decoration-zone="marquee"
                        >
                            <FloatingElementsLayer
                                decorations={c.decorations ?? []}
                                path="team.decorations"
                                targetFilter="marquee"
                            />
                            <EditableList
                                arrayPath="team.members"
                                items={c.members}
                                defaultNewItem={NEW_MEMBER_DEFAULT}
                                addLabel="Add team member"
                                as="div"
                                className="contents"
                                renderItem={(m, i) => (
                                    <CoinMember member={m} index={i} coinFrame={effectiveCoinFrame} />
                                )}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                /* Production: TWO team-coin-set containers (set + duplicate),
                 * each with its own layer covering 1 set's width. Decoration
                 * left% is consistent with edit mode. The seamless-loop
                 * wraparound is automatic because both sets render the same
                 * decoration data. */
                <div className="team-marquee relative w-full overflow-hidden py-2">
                    <div className="team-marquee-inner flex gap-12 w-max relative">
                        <div className="team-coin-set relative flex gap-12">
                            <FloatingElementsLayer
                                decorations={c.decorations ?? []}
                                path="team.decorations"
                                targetFilter="marquee"
                            />
                            {c.members.map((m, i) => (
                                <CoinMember key={`s1-${i}`} member={m} index={i} coinFrame={effectiveCoinFrame} />
                            ))}
                        </div>
                        <div className="team-coin-set relative flex gap-12">
                            <FloatingElementsLayer
                                decorations={c.decorations ?? []}
                                path="team.decorations"
                                targetFilter="marquee"
                            />
                            {c.members.map((m, i) => (
                                <CoinMember
                                    key={`s2-${i}`}
                                    member={m}
                                    index={i}
                                    coinFrame={effectiveCoinFrame}
                                    isDuplicate
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            </div>
        </CRevealSection>
    );
}
