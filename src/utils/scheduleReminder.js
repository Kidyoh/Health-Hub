const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

async function sendReminders() {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 1 * 60 * 60 * 1000); // Remind 1 hour before session

  // Fetch upcoming teleconsultations within the next hour
  const upcomingConsultations = await prisma.teleconsultation.findMany({
    where: {
      date: {
        lte: reminderTime,
        gte: now,
      },
      status: 'Approved',
    },
    include: {
      user: true, // Include user information to send emails
    },
  });

  for (const consultation of upcomingConsultations) {
    const content = 'Your teleconsultation is starting soon. Please be prepared.';

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: consultation.userId,
        type: 'Reminder',
        content,
      },
    });

    // Send email reminder
    if (consultation.user.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Your email address
        to: consultation.user.email,  // User's email address
        subject: 'Teleconsultation Reminder',
        text: `Dear ${consultation.user.firstName || 'User'},\n\nYour teleconsultation with Dr. ${consultation.doctor} is starting in less than an hour. Please be ready to join the session.\n\nBest regards,\nYour Health Service Team`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Failed to send email to ${consultation.user.email}:`, error);
        } else {
          console.log(`Email sent to ${consultation.user.email}:`, info.response);
        }
      });
    }
  }
}

// Schedule the job to run every 15 minutes
cron.schedule('*/15 * * * *', sendReminders);
