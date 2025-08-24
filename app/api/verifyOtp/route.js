import { connectToDB } from "@/utils/db";
import Otp from "@/models/Otp";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  const { email, otp } = await req.json();

  try {
    await connectToDB();

    // find OTP
    const otprecord = await Otp.findOne({ email });
    if (!otprecord) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP not found or expired" }),
        { status: 400 }
      );
    }

    // check OTP
    if (otprecord.otp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 400 }
      );
    }

    // check if user already exists
    let user = await Subscriber.findOne({ email });
    if (!user) {
      // if not found, create new subscriber
      user = await Subscriber.create({ email });
    }

    // delete OTP after successful verification
    await Otp.deleteOne({ email });

    return new Response(
      JSON.stringify({ success: true, message: "Verified successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Verification failed" }),
      { status: 500 }
    );
  }
}
