import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        project: {
          select: {
            name: true,
            client: { select: { email: true, profile: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices.filter((inv) => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0);
    const outstanding = totalInvoiced - totalPaid;

    // Financial forecast
    const monthlyForecast = totalPaid * 1.15; // 15% estimated growth
    const quarterlyForecast = totalPaid * 3.5;

    return NextResponse.json({
      invoices,
      stats: {
        totalInvoiced,
        totalPaid,
        outstanding,
        monthlyForecast,
        quarterlyForecast,
      },
    });
  } catch (err) {
    console.error('Error fetching admin finance metrics:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, amount, dueDate, status, paymentNotes } = await request.json();

    if (!projectId || !amount || !dueDate) {
      return NextResponse.json({ error: 'Project ID, amount, and due date are required.' }, { status: 400 });
    }

    // Generate consecutive invoice numbering
    const totalCount = await prisma.invoice.count();
    const invoiceNumber = `INV-2026-${(totalCount + 1).toString().padStart(3, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        projectId,
        invoiceNumber,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: status || 'UNPAID',
        paymentNotes,
      },
    });

    // Notify client of new invoice
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.clientId,
          type: 'INVOICE_UPDATE',
          title: `New Invoice Generated: ${invoiceNumber}`,
          message: `Invoice ${invoiceNumber} for amount $${Number(amount).toLocaleString()} is due on ${new Date(dueDate).toLocaleDateString()}.`,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'INVOICE_CREATED',
        details: { invoiceId: invoice.id, invoiceNumber, amount },
      },
    });

    return NextResponse.json(invoice);
  } catch (err) {
    console.error('Error creating finance invoice:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { invoiceId, status, paymentNotes } = await request.json();

    if (!invoiceId || !status) {
      return NextResponse.json({ error: 'Invoice ID and status are required.' }, { status: 400 });
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status, paymentNotes },
      include: { project: true },
    });

    // Notify client of payment status change
    await prisma.notification.create({
      data: {
        userId: invoice.project.clientId,
        type: 'INVOICE_UPDATE',
        title: `Invoice Status Updated: ${invoice.invoiceNumber}`,
        message: `Invoice ${invoice.invoiceNumber} status has been updated to ${status}.`,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: `INVOICE_STATUS_${status}`,
        details: { invoiceId, status },
      },
    });

    return NextResponse.json(invoice);
  } catch (err) {
    console.error('Error updating finance invoice:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
