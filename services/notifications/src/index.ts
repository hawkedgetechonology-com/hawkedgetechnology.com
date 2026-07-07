export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';

export interface NotificationPayload {
  recipient: string;
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface INotificationProvider {
  send(payload: NotificationPayload): Promise<boolean>;
}

// 1. Email Provider
export class EmailProvider implements INotificationProvider {
  async send(payload: NotificationPayload): Promise<boolean> {
    // eslint-disable-next-line no-console
    console.log(`[Email Dispatcher] To: ${payload.recipient} | Subject: ${payload.subject} | Body: ${payload.body}`);
    return true;
  }
}

// 2. SMS Provider
export class SmsProvider implements INotificationProvider {
  async send(payload: NotificationPayload): Promise<boolean> {
    // eslint-disable-next-line no-console
    console.log(`[SMS Dispatcher] To: ${payload.recipient} | Message: ${payload.body}`);
    return true;
  }
}

// 3. WhatsApp Provider
export class WhatsAppProvider implements INotificationProvider {
  async send(payload: NotificationPayload): Promise<boolean> {
    // eslint-disable-next-line no-console
    console.log(`[WhatsApp Dispatcher] To: ${payload.recipient} | Text: ${payload.body}`);
    return true;
  }
}

// 4. Push Notification Provider
export class PushProvider implements INotificationProvider {
  async send(payload: NotificationPayload): Promise<boolean> {
    // eslint-disable-next-line no-console
    console.log(`[Push Dispatcher] Target Token: ${payload.recipient} | Body: ${payload.body}`);
    return true;
  }
}

// Centered Notification Engine
export class NotificationService {
  private emailProvider = new EmailProvider();
  private smsProvider = new SmsProvider();
  private whatsappProvider = new WhatsAppProvider();
  private pushProvider = new PushProvider();

  async sendNotification(
    channels: NotificationChannel[],
    payload: NotificationPayload,
  ): Promise<Record<NotificationChannel, boolean>> {
    const results = {} as Record<NotificationChannel, boolean>;

    for (const channel of channels) {
      try {
        let success = false;
        switch (channel) {
          case 'EMAIL':
            success = await this.emailProvider.send(payload);
            break;
          case 'SMS':
            success = await this.smsProvider.send(payload);
            break;
          case 'WHATSAPP':
            success = await this.whatsappProvider.send(payload);
            break;
          case 'PUSH':
            success = await this.pushProvider.send(payload);
            break;
        }
        results[channel] = success;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Failure sending notification channel: ${channel}`, err);
        results[channel] = false;
      }
    }

    return results;
  }
}
