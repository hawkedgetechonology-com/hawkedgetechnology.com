import { NextRequest } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      lead: true,
      versions: { orderBy: { version: 'desc' }, take: 1 },
      quotations: { include: { items: true } },
    },
  });

  if (!proposal) {
    return new Response('Proposal not found.', { status: 404 });
  }

  const currentVersion = proposal.versions[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: Record<string, string> = (currentVersion?.sections as any) ?? {};

  try {
    // ESM-only package — must be dynamically imported at runtime.
    // Do NOT convert this to a static import; webpack cannot bundle @react-pdf/renderer.
    const {
      renderToBuffer,
      Document,
      Page,
      Text,
      View,
      StyleSheet,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = (await import('@react-pdf/renderer')) as any;

    const SECTION_LABELS: Record<string, string> = {
      projectUnderstanding: '01. Project Understanding',
      scopeOfWork: '02. Scope of Work',
      deliverables: '03. Deliverables & Milestones',
      techStack: '04. Technology Stack',
      timeline: '05. Project Timeline',
      teamStructure: '06. Team Structure',
      assumptions: '07. Assumptions',
      exclusions: '08. Exclusions',
      support: '09. Support & Maintenance',
      terms: '10. Terms & Conditions',
      acceptance: '11. Acceptance',
    };

    const styles = StyleSheet.create({
      page: { backgroundColor: '#0a0a0a', padding: 48, fontFamily: 'Helvetica' },
      coverBar: { backgroundColor: '#5b21b6', height: 4, marginBottom: 32 },
      header: { marginBottom: 40 },
      brand: { fontSize: 8, color: '#7c3aed', letterSpacing: 4, marginBottom: 8 },
      title: { fontSize: 22, color: '#fafafa', fontFamily: 'Helvetica-Bold', lineHeight: 1.3 },
      subtitle: { fontSize: 9, color: '#71717a', marginTop: 8 },
      meta: { flexDirection: 'row', gap: 24, marginTop: 16 },
      metaItem: { fontSize: 8, color: '#a1a1aa' },
      metaLabel: { color: '#7c3aed', fontFamily: 'Helvetica-Bold' },
      section: { marginBottom: 28 },
      sectionLabel: { fontSize: 7, color: '#7c3aed', letterSpacing: 2, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
      sectionText: { fontSize: 9, color: '#d4d4d8', lineHeight: 1.7 },
      divider: { height: 0.5, backgroundColor: '#27272a', marginVertical: 20 },
      footer: { position: 'absolute', bottom: 32, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between' },
      footerText: { fontSize: 7, color: '#52525b' },
    });

    const doc = Document({},
      Page({ size: 'A4', style: styles.page },
        View({ style: styles.coverBar }),
        View({ style: styles.header },
          Text({ style: styles.brand }, 'HAWKEDGE ENGINEERING'),
          Text({ style: styles.title }, proposal.title),
          Text({ style: styles.subtitle }, `Prepared for ${proposal.lead.companyName} · ${proposal.lead.fullName}`),
          View({ style: styles.meta },
            View({},
              Text({ style: styles.metaItem },
                Text({ style: styles.metaLabel }, 'DATE  '),
                new Date(proposal.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              )
            ),
            View({},
              Text({ style: styles.metaItem },
                Text({ style: styles.metaLabel }, 'VERSION  '),
                `v${proposal.currentVersion}`
              )
            ),
          ),
        ),
        View({ style: styles.divider }),
        ...Object.entries(SECTION_LABELS)
          .filter(([key]) => sections[key]?.trim())
          .map(([key, label]) =>
            View({ style: styles.section },
              Text({ style: styles.sectionLabel }, label.toUpperCase()),
              Text({ style: styles.sectionText }, sections[key] ?? '')
            )
          ),
        View({ style: styles.footer },
          Text({ style: styles.footerText }, 'HawkEdge Engineering · Confidential'),
          Text({ style: styles.footerText }, `Ref: ${proposal.id.substring(0, 8).toUpperCase()}`),
        )
      )
    );

    const buffer = (await renderToBuffer(doc)) as unknown as Uint8Array;

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=PROPOSAL-${proposal.id.substring(0, 8).toUpperCase()}.pdf`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    return new Response('PDF generation failed. Please try again later.', { status: 500 });
  }
}
