/**
 * /contact-us — CMS-driven page (migrated from static in #76).
 *
 * Server-side: fetch ContactPageContent from the site_content table at
 * slug "contact-us". Falls back to bundled DEFAULT_CONTACT_PAGE if the DB
 * row hasn't been created yet (first admin save persists it).
 *
 * Client-side: ContactPageBody wraps the existing layout in EditModeProvider
 * with a slug-aware saveFn so admins can edit text inline (same in-page
 * editor as the homepage).
 */

import { fetchGenericPage, DEFAULT_CONTACT_PAGE, type ContactPageContent } from "@/lib/site-content";
import ContactPageBody from "./_components/ContactPageBody";

export const dynamic = "force-dynamic";

export default async function ContactUs() {
    const fetched = await fetchGenericPage("contact-us");
    const content: ContactPageContent =
        (fetched as unknown as ContactPageContent) ?? DEFAULT_CONTACT_PAGE;
    return <ContactPageBody initialContent={content} />;
}
