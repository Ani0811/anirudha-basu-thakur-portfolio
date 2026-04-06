import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure the transporter with environment variables
    // Prefer explicit SMTP host/port when provided, otherwise fall back to 'service'
    const transporterConfig: any = {};
    if (process.env.EMAIL_HOST) {
      transporterConfig.host = process.env.EMAIL_HOST;
      transporterConfig.port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
      transporterConfig.secure = process.env.EMAIL_SECURE === 'true';
      transporterConfig.auth = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      };
      // Allow self-signed certs in non-production (useful for local dev behind intercepting proxies)
      if (process.env.NODE_ENV !== 'production') {
        transporterConfig.tls = { rejectUnauthorized: false };
      }
    } else {
      transporterConfig.service = process.env.EMAIL_SERVICE || 'gmail';
      transporterConfig.auth = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      };
      if (process.env.NODE_ENV !== 'production') {
        transporterConfig.tls = { rejectUnauthorized: false };
      }
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    // Verify transporter configuration early so we return a helpful error
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('Nodemailer verify error:', verifyError);
      const message = (verifyError && (verifyError as any).message) || 'Transport verification failed';
      return NextResponse.json({ error: `Mail transport verification failed: ${message}` }, { status: 500 });
    }

    // Format current time in IST as dd-mm-yyyy HH:MM:SS
    const istTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date()).replace(/\//g, '-').replace(',', '');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'anirudha.basuthakur@gmail.com', // Your portfolio email
      subject: `Portfolio Contact ─ ${name}`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 650px; margin: 20px auto; background-color: #0a0a0c; color: #e2e8f0; padding: 40px; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 25px; margin-bottom: 25px;">
            <div style="display: inline-block; background-color: rgba(34, 211, 238, 0.1); border: 1px solid rgba(34, 211, 238, 0.3); color: #22d3ee; padding: 8px 16px; border-radius: 20px; font-weight: bold; letter-spacing: 2px; font-size: 12px; margin-bottom: 15px;">
              SYSTEM NOTIFICATION
            </div>
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-family: sans-serif; letter-spacing: -0.5px;">New Outbound Contact</h2>
          </div>

          <!-- Metadata -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <td style="padding: 12px 15px; background-color: #111116; width: 100px; color: #22d3ee; border-top-left-radius: 8px; border-bottom-left-radius: 8px; border: 1px solid #1e293b; border-right: none; font-size: 14px;"><strong>SENDER</strong></td>
              <td style="padding: 12px 15px; background-color: #0f1420; color: #ffffff; border-top-right-radius: 8px; border-bottom-right-radius: 8px; border: 1px solid #1e293b; border-left: none; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"></td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background-color: #111116; width: 100px; color: #22d3ee; border-top-left-radius: 8px; border-bottom-left-radius: 8px; border: 1px solid #1e293b; border-right: none; font-size: 14px;"><strong>REPLY-TO</strong></td>
              <td style="padding: 12px 15px; background-color: #0f1420; border-top-right-radius: 8px; border-bottom-right-radius: 8px; border: 1px solid #1e293b; border-left: none;">
                <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none; font-size: 15px; font-family: sans-serif;">${email}</a>
              </td>
            </tr>
          </table>

          <!-- Message Body -->
          <div style="margin-top: 10px;">
            <p style="color: #64748b; font-size: 12px; letter-spacing: 1px; margin-bottom: 8px;">PAYLOAD DATA:</p>
            <div style="background-color: #111116; padding: 25px; border-radius: 8px; border: 1px solid #1e293b; color: #cbd5e1; font-family: sans-serif; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${message}</div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px dashed #1e293b; text-align: center;">
            <p style="color: #475569; font-size: 12px; margin: 0;">Transmitted via Your Portfolio App</p>
            <p style="color: #334155; font-size: 10px; margin-top: 5px;">Time: ${istTime} IST</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Nodemailer error:', error);
    // In development return the real error message to help debugging. In production keep it generic.
    if (process.env.NODE_ENV !== 'production') {
      const msg = (error && (error as any).message) || 'Unknown error';
      return NextResponse.json({ error: `Failed to send email: ${msg}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to send email. Please try again later.' }, { status: 500 });
  }
}
