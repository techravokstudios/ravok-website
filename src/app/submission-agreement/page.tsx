/**
 * /submission-agreement — CMS-driven legal page (migrated from static).
 * Server fetches LegalPageContent from slug "submission-agreement" with
 * bundled DEFAULT_SUBMISSION_AGREEMENT as fallback.
 */

import {
    fetchGenericPage,
    fetchNavbarContent,
    DEFAULT_SUBMISSION_AGREEMENT,
    DEFAULT_NAVBAR,
    type LegalPageContent,
} from "@/lib/site-content";
import LegalPageBody from "@/app/_components/LegalPageBody";

export const dynamic = "force-dynamic";

export default async function SubmissionAgreementPage() {
    const [fetched, navbar] = await Promise.all([
        fetchGenericPage("submission-agreement"),
        fetchNavbarContent(),
    ]);
    const content: LegalPageContent =
        (fetched as unknown as LegalPageContent) ?? DEFAULT_SUBMISSION_AGREEMENT;
    return (
        <LegalPageBody
            slug="submission-agreement"
            initialContent={content}
            navbar={navbar ?? DEFAULT_NAVBAR}
        />
    );
}
