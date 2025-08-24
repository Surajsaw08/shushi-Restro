import { connectToDB } from "@/utils/db";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  const { email } = await req.json();

  try {
    await connectToDB();

    const user = await Subscriber.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Email not subscribed" }),
        { status: 400 }
      );
    }
    if (user) {
      return new Response(
        JSON.stringify({ success: true, message: "Email verified" }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
