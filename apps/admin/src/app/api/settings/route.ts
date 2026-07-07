import { NextRequest, NextResponse } from 'next/server';

// Temporary memory store for company configuration settings since it's global
let settingsConfig = {
  companyName: 'HawkEdge Systems Inc.',
  website: 'https://hawkedge.tech',
  businessHours: '09:00 - 18:00 EST',
  taxRatePercent: 8.25,
  invoicePrefix: 'INV-2026-',
  currency: 'USD',
  allowCustomQuotes: true,
  alertWebhookUrl: 'https://hooks.slack.com/services/mock',
};

export async function GET() {
  return NextResponse.json(settingsConfig);
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    settingsConfig = {
      ...settingsConfig,
      ...data,
    };
    return NextResponse.json(settingsConfig);
  } catch (err) {
    console.error('Error updating settings config:', err);
    return NextResponse.json({ error: 'Failed to process config update.' }, { status: 500 });
  }
}
