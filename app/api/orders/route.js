import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer"

export async function POST(req) {
  try {
    const { billingInfo, cart, total } = await req.json();

    console.log("Received order data:", { billingInfo, cart, total });
    if (
      !billingInfo ||
      !billingInfo.firstName ||
      !billingInfo.lastName ||
      !billingInfo.email ||
      !billingInfo.phone
    ) {
      console.error("Invalid billing info!");
      return Response.json(
        { error: "Billing details are required!" },
        { status: 400 }
      );
    }

    if ( !cart || cart.length === 0 || total === 0) {
      console.error("Invalid order data");
      return Response.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    await connectToDB(); //  Connect to MongoDB

    const newOrder = new Order({
      billingInfo,
      cart,
      total,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    console.log("Order saved successfully!");

    // to send email to admin
    await sendOrderEmail(newOrder);

    return Response.json({ message: "Order placed successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error in API:", error);
    return Response.json(
      { error: "Failed to place order", details: error.message },
      { status: 500 }
    );
  }
}

// to send  email using Nodemailer

async function sendOrderEmail(order) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "surajsaw0801@gmail.com", 
    subject: "New Order Received",
    html: `
      <h2>New Order Received</h2>
      <p><strong>Customer:</strong> ${order.billingInfo.firstName} ${order.billingInfo.lastName}</p>
      <p><strong>Email:</strong> ${order.billingInfo.email}</p>
      <p><strong>Phone:</strong> ${order.billingInfo.phone}</p>
      <h3>Order Summary:</h3>
      <ul>
        ${order.cart.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join("")}
      </ul>
      <h3>Total: ₹${order.total}</h3>
       <p><strong>Status:</strong> ${order.status}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
