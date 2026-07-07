export function sendTransactionalEmail(recipient: string, subject: string, body: string): void {
  // eslint-disable-next-line no-console
  console.log(`[Email Dispatch] Sent to: ${recipient} | Subject: ${subject} | Body preview: ${body.substring(0, 50)}`);
}
