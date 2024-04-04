import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class MailSender {
  async mailSend(
    recieptant: string,
    client: string,
    subject: string,
    message: string,
  ): Promise<any> {
    try {
      const mailerSend = new MailerSend({
        apiKey: process.env.MAIL_SENDER_API_KEY,
      });

      const sentFrom = new Sender(
        'anamul.ice14@trial-pr9084z1jrjgw63d.mlsender.net',
        'Anamul',
      );

      const recipients = [
        // new Recipient('anamul.ice14@gmail.com',),
        new Recipient(recieptant, client),
      ];
      const cc = [new Recipient('your_cc@client.com', 'Your Client CC')];
      const bcc = [new Recipient('your_bcc@client.com', 'Your Client BCC')];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(subject)
        .setText(message);

      await mailerSend.email.send(emailParams);
    } catch (error) {
      console.log(error);
    }
  }
}
