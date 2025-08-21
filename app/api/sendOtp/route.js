import { connectToDB } from "@/utils/db";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  const { email } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await connectToDB();
    const user = await Subscriber.findOne({ email });
    if (user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "you are already subscribed",
        }),
        { status: 400 }
      );
    }

    //delete existing otp
    await Otp.deleteMany({ email });

    //create new otp
    await Otp.create({ email, otp });

    // to send mail
    // 1. configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // send mail
    await transporter.sendMail({
      from: `"Shushi Restorent" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Your OTP Code",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">Email Verification</h2>
      <p style="text-align: center; color: #555;">Use the OTP below to complete your verification. It will expire in <b>5 minutes</b>.</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; letter-spacing: 8px; font-weight: bold; color: #2c3e50; background: #fff; padding: 10px 20px; border: 2px dashed #2c3e50; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="text-align: center; color: #999; font-size: 12px;">If you did not request this, please ignore.</p>
    </div>
  `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "OTP sent failed" }),
      { status: 500 }
    );
  }
}
