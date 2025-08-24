import { connectToDB } from "@/utils/db";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  const { email } = await req.json();

  try {
    await connectToDB();
    await Subscriber.deleteOne({ email });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
