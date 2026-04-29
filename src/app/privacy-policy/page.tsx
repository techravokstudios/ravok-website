/**
 * /privacy-policy — CMS-driven legal page (migrated from static).
 * Server fetches LegalPageContent from slug "privacy-policy" with
 * bundled DEFAULT_PRIVACY_POLICY as fallback.
 */

import {
    fetchGenericPage,
    fetchNavbarContent,
    DEFAULT_PRIVACY_POLICY,
    DEFAULT_NAVBAR,
    type LegalPageContent,
} from "@/lib/site-content";
import LegalPageBody from "@/app/_components/LegalPageBody";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
    const [fetched, navbar] = await Promise.all([
        fetchGenericPage("privacy-policy"),
        fetchNavbarContent(),
    ]);
    const content: LegalPageContent =
        (fetched as unknown as LegalPageContent) ?? DEFAULT_PRIVACY_POLICY;
    return (
        <LegalPageBody
            slug="privacy-policy"
            initialContent={content}
            navbar={navbar ?? DEFAULT_NAVBAR}
        />
    );
}
