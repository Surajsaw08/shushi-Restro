import { connectToDB } from "@/utils/db";
import Otp from "@/models/Otp";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  const { email, otp } = await req.json();

  try {
    await connectToDB();
    //find otp
    const otprecord = await Otp.findOne({ email });
    if (!otprecord) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP not found or expired" }),
        { status: 400 }
      );
    }

    //check otp

    if (otprecord.otp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 400 }
      );
    }

    //  check if user is present already in subscriber collection
    // if present then return error
    const user = await Subscriber.findOne({ email });
    if (user) {
      return new Response(
        JSON.stringify({ success: false, message: "User already exists" }),
        { status: 400 }
      );
    }
    // if user not present then create new user

    await Subscriber.create({ email });

    // delete OTP after successful verification
    await Otp.deleteOne({ email });

    return new Response(
      JSON.stringify({ success: true, message: "Subscribed successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Verification failed" }),
      { status: 500 }
    );
  }
}
