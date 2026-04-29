/**
 * /terms-and-conditions — CMS-driven legal page (migrated from static).
 * Server fetches LegalPageContent from slug "terms-and-conditions" with
 * bundled DEFAULT_TERMS_AND_CONDITIONS as fallback.
 */

import {
    fetchGenericPage,
    fetchNavbarContent,
    DEFAULT_TERMS_AND_CONDITIONS,
    DEFAULT_NAVBAR,
    type LegalPageContent,
} from "@/lib/site-content";
import LegalPageBody from "@/app/_components/LegalPageBody";

export const dynamic = "force-dynamic";

export default async function TermsAndConditionsPage() {
    const [fetched, navbar] = await Promise.all([
        fetchGenericPage("terms-and-conditions"),
        fetchNavbarContent(),
    ]);
    const content: LegalPageContent =
        (fetched as unknown as LegalPageContent) ?? DEFAULT_TERMS_AND_CONDITIONS;
    return (
        <LegalPageBody
            slug="terms-and-conditions"
            initialContent={content}
            navbar={navbar ?? DEFAULT_NAVBAR}
        />
    );
}
