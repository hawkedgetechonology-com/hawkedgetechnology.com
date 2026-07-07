// @ts-ignore
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Premium editorial styles for HawkEdge branded documents
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    color: '#0f172a',
  },
  tagline: {
    fontSize: 7,
    color: '#64748b',
    marginTop: 2,
    fontFamily: 'Helvetica',
    letterSpacing: 0.5,
  },
  metaSection: {
    textAlign: 'right',
  },
  docType: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#6366f1',
    letterSpacing: 1,
  },
  docId: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginTop: 15,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paragraph: {
    marginBottom: 10,
    color: '#334155',
    textAlign: 'justify',
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  gridCol: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: '#0f172a',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderCol: {
    backgroundColor: '#f8fafc',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 8,
  },
  tableCellLeft: {
    fontSize: 8,
    textAlign: 'left',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: '#6366f1',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#94a3b8',
  },
});

// 1. Reusable Proposal PDF Document
export const ProposalPDF = ({ data }: { data: any }) => {
  const sections = data.sections || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>HAWKEDGE ENGINEERING</Text>
            <Text style={styles.tagline}>PRECISION SYSTEMS DESIGN & SLA DEVELOPMENT</Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.docType}>PROJECT PROPOSAL</Text>
            <Text style={styles.docId}>REF: PRO-{data.id?.substring(0, 8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Metadata Grid */}
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Prepared For</Text>
            <Text style={styles.value}>{data.lead?.companyName || 'Valued Partner'}</Text>
            <Text style={styles.value}>{data.lead?.fullName || ''}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Proposal Title</Text>
            <Text style={styles.value}>{data.title || 'Systems Architecture Scope'}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>Version: {data.version || 1}</Text>
            <Text style={styles.value}>Date: {new Date(data.createdAt || Date.now()).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Sections Content */}
        <View>
          <Text style={styles.sectionTitle}>1. Project Understanding</Text>
          <Text style={styles.paragraph}>{sections.projectUnderstanding || 'No input provided.'}</Text>

          <Text style={styles.sectionTitle}>2. Scope of Work</Text>
          <Text style={styles.paragraph}>{sections.scopeOfWork || 'No input provided.'}</Text>

          <Text style={styles.sectionTitle}>3. Deliverables & Milestones</Text>
          <Text style={styles.paragraph}>{sections.deliverables || 'No input provided.'}</Text>

          <Text style={styles.sectionTitle}>4. Technology Stack</Text>
          <Text style={styles.paragraph}>{sections.techStack || 'No input provided.'}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>HAWKEDGE &bull; CONFIDENTIAL SYSTEMS BRIEF &bull; {new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

// 2. Reusable Quotation PDF Document
export const QuotationPDF = ({ data }: { data: any }) => {
  const items = data.items || [];
  const tax = data.taxRate ? data.totalAmount * data.taxRate : 0;
  const discount = data.discount || 0;
  const finalTotal = data.totalAmount + tax - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>HAWKEDGE ENGINEERING</Text>
            <Text style={styles.tagline}>PRECISION SYSTEMS DESIGN & SLA DEVELOPMENT</Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.docType}>COMMERCIAL QUOTATION</Text>
            <Text style={styles.docId}>NO: {data.quotationNumber || 'Q-TEMP'}</Text>
          </View>
        </View>

        {/* Metadata Grid */}
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Client Account Details</Text>
            <Text style={styles.value}>{data.lead?.companyName || 'Valued Partner'}</Text>
            <Text style={styles.value}>{data.lead?.fullName || ''}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Valid Until</Text>
            <Text style={styles.value}>{new Date(data.validUntil || Date.now()).toLocaleDateString()}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Payment Terms</Text>
            <Text style={styles.value}>{data.paymentTerms || 'Standard SLA Net 30'}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCol, { width: '50%' }]}>
              <Text style={[styles.tableCellLeft, { fontWeight: 'bold' }]}>Scope Description</Text>
            </View>
            <View style={[styles.tableHeaderCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>Qty</Text>
            </View>
            <View style={[styles.tableHeaderCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>Rate</Text>
            </View>
            <View style={[styles.tableHeaderCol, { width: '20%' }]}>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
          </View>

          {/* Table Body */}
          {items.map((item: any, i: number) => (
            <View style={styles.tableRow} key={item.id || i}>
              <View style={[styles.tableCol, { width: '50%' }]}>
                <Text style={styles.tableCellLeft}>{item.description}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableCell}>{data.currency || 'USD'} {item.rate.toLocaleString()}</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>{data.currency || 'USD'} {item.amount.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary Details */}
        <View style={styles.totalSection}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text style={styles.paragraph}>Subtotal: {data.currency || 'USD'} {data.totalAmount.toLocaleString()}</Text>
            {tax > 0 && <Text style={styles.paragraph}>Tax: {data.currency || 'USD'} {tax.toLocaleString()}</Text>}
            {discount > 0 && <Text style={styles.paragraph}>Discount: -{data.currency || 'USD'} {discount.toLocaleString()}</Text>}
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={styles.totalLabel}>TOTAL ESTIMATE:</Text>
              <Text style={styles.totalValue}>{data.currency || 'USD'} {finalTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>HAWKEDGE &bull; COMMERCIAL BRIEF &bull; {new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

// 3. Reusable Invoice PDF Document
export const InvoicePDF = ({ data }: { data: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>HAWKEDGE ENGINEERING</Text>
            <Text style={styles.tagline}>PRECISION SYSTEMS DESIGN & SLA DEVELOPMENT</Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.docType}>TAX INVOICE</Text>
            <Text style={styles.docId}>NO: {data.invoiceNumber || 'INV-TEMP'}</Text>
          </View>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Invoice To</Text>
            <Text style={styles.value}>{data.clientName || 'Valued Client'}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Issue Date</Text>
            <Text style={styles.value}>{new Date(data.createdAt || Date.now()).toLocaleDateString()}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Amount Due</Text>
            <Text style={styles.value}>USD {data.amount?.toLocaleString()}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Payment SLA Notice</Text>
        <Text style={styles.paragraph}>This document records system engineering milestones achieved. Remittance coordinates are detailed on the administrative registry portal. Outstanding billing parameters are subject to late fee metrics after the SLA term expiration.</Text>
        <View style={styles.footer} fixed>
          <Text>HAWKEDGE &bull; INVOICE BRIEF &bull; {new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

// 4. Reusable Contract PDF Document
export const ContractPDF = ({ data }: { data: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>HAWKEDGE ENGINEERING</Text>
            <Text style={styles.tagline}>PRECISION SYSTEMS DESIGN & SLA DEVELOPMENT</Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.docType}>MASTER AGREEMENT</Text>
            <Text style={styles.docId}>REF: CON-{data.id?.substring(0, 8).toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>1. Scope & Execution</Text>
        <Text style={styles.paragraph}>This Master Services Agreement governs the engineering deliverables detailed in the linked project blueprint files. Both coordinates execute operations adhering to strict SLA uptime and database isolation scopes.</Text>
        <Text style={styles.sectionTitle}>2. Signatures</Text>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>For HawkEdge Engineering</Text>
            <Text style={styles.value}>Authorized Signature</Text>
            <Text style={styles.docId}>Date: {new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>For Client partner</Text>
            <Text style={styles.value}>Pending Execution</Text>
          </View>
        </View>
        <View style={styles.footer} fixed>
          <Text>HAWKEDGE &bull; SERVICE AGREEMENT &bull; {new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

// 5. Reusable Certificate PDF Document
export const CertificatePDF = ({ data }: { data: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ border: '2px solid #6366f1', padding: 20, height: '100%' }}>
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={[styles.brandName, { fontSize: 20 }]}>HAWKEDGE ENGINEERING</Text>
            <Text style={styles.tagline}>COMPLETION CERTIFICATE & QUALITY ASSURANCE</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Text style={styles.label}>This certifies that the system project</Text>
            <Text style={[styles.value, { fontSize: 16, marginTop: 10 }]}>{data.projectName || 'Enterprise Compilation'}</Text>
            <Text style={[styles.paragraph, { marginTop: 20, textAlign: 'center' }]}>has successfully undergone static analysis, full-suite automated unit verification runs, and is hereby certified for production pipeline promotion.</Text>
          </View>
          <View style={[styles.grid, { marginTop: 150 }]}>
            <View style={[styles.gridCol, { alignItems: 'center' }]}>
              <Text style={styles.value}>Sarah Jenkins</Text>
              <Text style={styles.label}>Client Sign-off</Text>
            </View>
            <View style={[styles.gridCol, { alignItems: 'center' }]}>
              <Text style={styles.value}>Architect</Text>
              <Text style={styles.label}>HawkEdge Verifier</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer} fixed>
          <Text>HAWKEDGE &bull; CERTIFICATE OF QUALITY &bull; {new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

// 6. Reusable Completion Report PDF Document
export const CompletionReportPDF = ({ data }: { data: any }) => {
  const milestones = data.milestones || [];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>HAWKEDGE ENGINEERING</Text>
            <Text style={styles.tagline}>PRECISION SYSTEMS DESIGN & SLA DEVELOPMENT</Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.docType}>COMPLETION REPORT</Text>
            <Text style={styles.docId}>REF: CR-{data.id?.substring(0, 8).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Project Name</Text>
            <Text style={styles.value}>{data.projectName || 'Enterprise Project'}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Client</Text>
            <Text style={styles.value}>{data.clientName || 'Valued Client'}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Completion Date</Text>
            <Text style={styles.value}>{new Date(data.completionDate || Date.now()).toLocaleDateString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Executive Summary</Text>
        <Text style={styles.paragraph}>{data.summary || 'This report documents the successful completion of all project deliverables as specified in the original scope of work agreement.'}</Text>

        <Text style={styles.sectionTitle}>2. Deliverables Completed</Text>
        {milestones.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, { width: '50%' }]}>
                <Text style={[styles.tableCellLeft, { fontWeight: 'bold' }]}>Milestone</Text>
              </View>
              <View style={[styles.tableHeaderCol, { width: '25%' }]}>
                <Text style={styles.tableCell}>Sprint</Text>
              </View>
              <View style={[styles.tableHeaderCol, { width: '25%' }]}>
                <Text style={styles.tableCell}>Status</Text>
              </View>
            </View>
            {milestones.map((m: any, i: number) => (
              <View style={styles.tableRow} key={m.id || i}>
                <View style={[styles.tableCol, { width: '50%' }]}>
                  <Text style={styles.tableCellLeft}>{m.title}</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCell}>{m.dateLabel || '-'}</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCell}>{m.status}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.paragraph}>All deliverables have been completed per the agreed schedule.</Text>
        )}

        <Text style={styles.sectionTitle}>3. Quality Assurance</Text>
        <Text style={styles.paragraph}>{data.qaReport || 'Full-suite automated testing, manual QA review, and performance benchmarking have been conducted. All acceptance criteria have been met or exceeded.'}</Text>

        <Text style={styles.sectionTitle}>4. Sign-Off</Text>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>For HawkEdge Engineering</Text>
            <Text style={styles.value}>Authorized Signature</Text>
            <Text style={styles.docId}>Date: {new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>For Client</Text>
            <Text style={styles.value}>{data.clientName || 'Pending'}</Text>
            <Text style={styles.docId}>Date: ____________</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>HAWKEDGE &bull; COMPLETION REPORT &bull; {new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

// Unified Document Engine Entrypoint
export type DocumentType = 'PROPOSAL' | 'QUOTATION' | 'INVOICE' | 'CONTRACT' | 'COMPLETION_REPORT' | 'CERTIFICATE';

export const DocumentEngine = ({ type, data }: { type: DocumentType; data: any }) => {
  switch (type) {
    case 'PROPOSAL':
      return <ProposalPDF data={data} />;
    case 'QUOTATION':
      return <QuotationPDF data={data} />;
    case 'INVOICE':
      return <InvoicePDF data={data} />;
    case 'CONTRACT':
      return <ContractPDF data={data} />;
    case 'COMPLETION_REPORT':
      return <CompletionReportPDF data={data} />;
    case 'CERTIFICATE':
      return <CertificatePDF data={data} />;
    default:
      throw new Error(`Unsupported document engine print type: ${type}`);
  }
};
