const nodemailer = require('nodemailer');

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST;
  //console.log(emailUser, emailPass, emailHost)
  if (!emailHost || emailHost === 'smtp.gmail.com' || (emailUser && emailUser.endsWith('@gmail.com'))) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
      secure: process.env.EMAIL_PORT == 465 ? true : false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass
      },
      connectionTimeout: 60000,
      greetingTimeout: 60000,
      socketTimeout: 60000,
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Custom SMTP fallback
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const isSecure = process.env.EMAIL_SECURE !== undefined
    ? process.env.EMAIL_SECURE === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host: emailHost,
    port: port,
    secure: isSecure,
    auth: {
      user: emailUser,
      pass: emailPass
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendEmail = async (type, userData) => {
  if (!emailTemplates[type]) {
    throw new Error(`Invalid email type: ${type}`);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Error: EMAIL_USER or EMAIL_PASS environment variables are missing on the server.');
    throw new Error('Server email configuration missing (EMAIL_USER / EMAIL_PASS)');
  }

  try {
    const transporter = createTransporter();
    const mailOptions = emailTemplates[type](userData);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ ${type} email sent successfully to ${userData.emailId}:`, info.response || info.messageId);
    return true;
  } catch (error) {
    console.error(`❌ Error sending ${type} email to ${userData?.emailId}:`, error.message);
    throw error;
  }
};

const senderAddress = () => `"Code Master Team" <${process.env.EMAIL_USER || 'no-reply@codemaster.com'}>`;

const emailTemplates = {
  register: (user) => ({
    from: senderAddress(),
    to: user.emailId,
    subject: 'Welcome to Code Master! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a6baf;">Welcome to Code Master, ${user.firstName}!</h1>
        <p>Congratulations on becoming part of our coding community! 🚀</p>
        
        <p>We're thrilled to have you join thousands of developers who are mastering their coding skills with us.</p>
        
        <div style="background-color: #f5f7fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>Your account details:</p>
          <ul>
            <li><strong>Name:</strong> ${user.firstName}</li>
            <li><strong>Email:</strong> ${user.emailId}</li>
            <li><strong>Join Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        </div>
        
        <p>Get started by exploring our courses and challenges designed to take your coding skills to the next level.</p>
        
        <p style="margin-top: 30px;">Happy Coding!<br>The Code Master Team</p>
      </div>
    `
  }),

  login: (user) => ({
    from: senderAddress(),
    to: user.emailId,
    subject: 'Successful Login to Code Master',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a6baf;">Welcome back, ${user.firstName}!</h1>
        <p>We noticed you just logged in to your Code Master account.</p>
        
        <div style="background-color: #f5f7fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>Login details:</p>
          <ul>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Device:</strong> ${user.device || 'Unknown device'}</li>
            <li><strong>Email:</strong> ${user.emailId}</li>
          </ul>
        </div>
        
        <p>If this wasn't you, please secure your account immediately by changing your password.</p>
        
        <p style="margin-top: 30px;">Keep coding!<br>The Code Master Team</p>
      </div>
    `
  }),

  otp: (user) => ({
    from: senderAddress(),
    to: user.emailId,
    subject: `${user.otp} is your Code Master verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white; letter-spacing: -0.5px;">
            ⚡ Code<span style="color: #fde68a;">Master</span>
          </h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Email Verification</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 32px; background: #1a1a2e;">
          <p style="margin: 0 0 8px; font-size: 16px; color: #94a3b8;">Hello${user.firstName ? ' ' + user.firstName : ''},</p>
          <p style="margin: 0 0 32px; font-size: 16px; color: #cbd5e1;">
            Use the verification code below to complete your sign-in. This code expires in <strong style="color: #f59e0b;">5 minutes</strong>.
          </p>
          
          <!-- OTP Box -->
          <div style="background: linear-gradient(135deg, #1e1e3a, #252540); border: 1px solid #3730a3; border-radius: 12px; padding: 32px; text-align: center; margin: 0 0 32px;">
            <p style="margin: 0 0 12px; font-size: 12px; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your Verification Code</p>
            <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #a5b4fc; font-family: 'Courier New', monospace;">
              ${user.otp}
            </div>
          </div>
          
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 16px; margin: 0 0 24px;">
            <p style="margin: 0; font-size: 13px; color: #fca5a5;">
              🔒 <strong>Never share this code</strong> with anyone. Code Master will never ask for your OTP.
            </p>
          </div>
          
          <p style="margin: 0; font-size: 13px; color: #475569;">
            If you didn't request this code, you can safely ignore this email. Someone may have typed your email address by mistake.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px 32px; background: #0f0f1a; text-align: center; border-top: 1px solid #1e293b;">
          <p style="margin: 0; font-size: 12px; color: #334155;">
            © ${new Date().getFullYear()} Code Master. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

module.exports = sendEmail;