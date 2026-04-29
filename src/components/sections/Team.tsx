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
                {/* Photo: EditableImage wrapper IS the coin-portrait so the
                    edit toolbar (Change/Remove/Transform) appears on hover. */}
                <EditableImage
                    path={`team.members.${index}.photo`}
                    value={member.photo}
                    wrapperClassName="coin-portrait"
                >
                    {(src) => <img src={src} alt="" />}
                </EditableImage>

                {/* Coin frame: separate EditableImage so admins can remove or
                    swap the gold wireframe ring. Path is at the team level
                    (shared across all members) so removing it removes for all. */}
                {!isDuplicate ? (
                    <EditableImage
                        path="team.coinFrame"
                        value={coinFrame}
                        wrapperClassName="coin-frame-wrap"
                    >
                        {(src) => (
                            <img className="coin-frame" src={src} alt="" aria-hidden="true" />
                        )}
                    </EditableImage>
                ) : coinFrame ? (
                    <img className="coin-frame" src={coinFrame} alt="" aria-hidden="true" />
                ) : null}
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

    // Render-time fallback only: if data still has the legacy wireframe SVG
    // path, swap to the laurel with sensible scales. Stored data is left
    // alone unless admin explicitly saves something else.
    const isLegacyData = c.coinFrame === LEGACY_WIREFRAME_PATH;
    const effectiveCoinFrame = isLegacyData ? LAUREL_URL : (c.coinFrame || LAUREL_URL);
    const frameScale = isLegacyData ? 130 : (c.coinFrameScale ?? 130);
    const portraitScale = isLegacyData ? 58 : (c.coinPortraitScale ?? 58);

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
                /* Edit mode: render the SAME marquee structure as production
                   but paused (animation off) and with one set instead of two.
                   This way the coordinate system for marquee-target decorations
                   matches production exactly — drop a decoration on Amanda's
                   coin in edit mode and it stays on Amanda's coin live.

                   The mask and overflow:hidden are also off so admin sees the
                   full row even if it overflows the section width. */
                <div className="team-marquee team-marquee--editing relative w-full py-2">
                    <div
                        className="team-marquee-inner flex gap-12 w-max relative"
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
                            className="flex gap-12"
                            renderItem={(m, i) => (
                                <CoinMember member={m} index={i} coinFrame={effectiveCoinFrame} />
                            )}
                        />
                    </div>
                </div>
            ) : (
                /* Production: scrolling coin marquee.
                 * Marquee-target decorations live inside team-marquee-inner so
                 * they translate with the coins. We render them TWICE (once
                 * native, once shifted +50%) so the seamless-loop wraparound
                 * also applies to decorations — same trick as the duplicate
                 * coin set. */
                <div className="team-marquee relative w-full overflow-hidden py-2">
                    <div className="team-marquee-inner flex gap-12 w-max relative">
                        {/* Layer 1 covers exactly 1 set's width (50% of the 2-
                            set track). Decoration left% is interpreted as a %
                            of 1 set — same coord space as edit mode where
                            marquee-inner IS just 1 set. */}
                        <FloatingElementsLayer
                            decorations={c.decorations ?? []}
                            path="team.decorations"
                            targetFilter="marquee"
                            style={{ width: "50%", left: 0 }}
                        />
                        {c.members.map((m, i) => (
                            <CoinMember key={`s1-${i}`} member={m} index={i} coinFrame={effectiveCoinFrame} />
                        ))}
                        {/* Layer 2 covers the second set's region. Same
                            decoration data, rendered again so the seamless
                            wraparound shows the decoration in both halves. */}
                        <FloatingElementsLayer
                            decorations={c.decorations ?? []}
                            path="team.decorations"
                            targetFilter="marquee"
                            style={{ width: "50%", left: "50%" }}
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
            )}
            </div>
        </CRevealSection>
    );
}
