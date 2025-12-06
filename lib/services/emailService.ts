import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendMatchedJobsEmail(email: string, jobs: any[]) {
  const jobList = jobs
    .map((job) => `<li><a href="${job.jobUrl}" target="_blank">${job.title}</a></li>`)
    .join("");

  await mailer.sendMail({
    from: `"Auto Apply System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔥 New Jobs Matched For You (${jobs.length})`,
    html: `
      <h2>Here are your matched jobs:</h2>
      <ul>${jobList}</ul>
      <p>These jobs match your profile. Apply fast!</p>
    `,
  });
}
