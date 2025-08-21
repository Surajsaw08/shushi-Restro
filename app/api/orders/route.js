import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { billingInfo, cart, total } = await req.json();

    console.log("Received order data:", { billingInfo, cart, total });
    if (
      !billingInfo ||
      !billingInfo.firstName ||
      !billingInfo.lastName ||
      !billingInfo.email ||
      !billingInfo.phone ||
      !billingInfo.address
    ) {
      console.error("Invalid billing info!");
      return Response.json(
        { error: "Billing details are required!" },
        { status: 400 }
      );
    }

    if (!cart || cart.length === 0 || total === 0) {
      console.error("Invalid order data");
      return Response.json({ error: "Invalid order data" }, { status: 400 });
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
    await sendConfermationMailToUser(newOrder);

    return Response.json(
      { message: "Order placed successfully!" },
      { status: 201 }
    );
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
      <p><strong>Customer:</strong> ${order.billingInfo.firstName} ${
      order.billingInfo.lastName
    }</p>
      <p><strong>Email:</strong> ${order.billingInfo.email}</p>
      <p><strong>Phone:</strong> ${order.billingInfo.phone}</p>
      <h3>Order Summary:</h3>
      <ul>
        ${order.cart
          .map(
            (item) =>
              `<li>${item.name} x ${item.quantity} - ₹${
                item.price * item.quantity
              }</li>`
          )
          .join("")}
      </ul>
      <h3>Total: ₹${order.total}</h3>
       <p><strong>Status:</strong> ${order.status}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendConfermationMailToUser(order) {
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
    from: "Shushi Restaurant <noreply@shushirestaurant.com>",
    to: order.billingInfo.email,
    subject: `Order Confirmation #${order.orderId || "ORD-" + Date.now()}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #d32f2f, #f57c00);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 5px;
                font-weight: bold;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .order-status {
                background-color: #e8f5e8;
                border-left: 4px solid #4caf50;
                padding: 15px;
                margin-bottom: 25px;
                border-radius: 4px;
            }
            
            .order-status.pending {
                background-color: #fff3e0;
                border-left-color: #ff9800;
            }
            
            .order-status.processing {
                background-color: #e3f2fd;
                border-left-color: #2196f3;
            }
            
            .section {
                margin-bottom: 25px;
            }
            
            .section h3 {
                color: #d32f2f;
                font-size: 18px;
                margin-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 8px;
            }
            
            .customer-info {
                background-color: #fafafa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .info-row {
                display: flex;
                margin-bottom: 8px;
            }
            
            .info-label {
                font-weight: bold;
                min-width: 80px;
                color: #666;
            }
            
            .order-items {
                border: 1px solid #eee;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #f0f0f0;
                background-color: #fff;
            }
            
            .item:last-child {
                border-bottom: none;
            }
            
            .item:nth-child(even) {
                background-color: #fafafa;
            }
            
            .item-details {
                flex-grow: 1;
            }
            
            .item-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }
            
            .item-quantity {
                color: #666;
                font-size: 14px;
            }
            
            .item-price {
                font-weight: bold;
                color: #d32f2f;
                font-size: 16px;
            }
            
            .total-section {
                background: linear-gradient(135deg, #f5f5f5, #eeeeee);
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
            }
            
            .total-amount {
                font-size: 24px;
                font-weight: bold;
                color: #d32f2f;
                margin: 10px 0;
            }
            
            .footer {
                background-color: #333;
                color: white;
                padding: 25px 20px;
                text-align: center;
            }
            
            .footer p {
                margin-bottom: 8px;
            }
            
            .contact-info {
                font-size: 14px;
                opacity: 0.8;
                margin-top: 15px;
            }
            
            .thank-you {
                background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin-top: 20px;
            }
            
            .emoji {
                font-size: 24px;
                margin-right: 10px;
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .content {
                    padding: 20px 15px;
                }
                
                .item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .item-price {
                    align-self: flex-end;
                }
                
                .info-row {
                    flex-direction: column;
                }
                
                .info-label {
                    min-width: auto;
                    margin-bottom: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>🍣 Shushi Restaurant</h1>
                <p>Your Order Has Been Confirmed!</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <!-- Order Status -->
                <div class="order-status ${order.status.toLowerCase()}">
                    <strong>Order Status: ${order.status}</strong>
                    <p>Order ID: #${order.orderId || "ORD-" + Date.now()}</p>
                </div>
                
                <!-- Customer Information -->
                <div class="section">
                    <h3>👤 Customer Information</h3>
                    <div class="customer-info">
                        <div class="info-row">
                            <span class="info-label">Name:</span>
                            <span>${order.billingInfo.firstName} ${
      order.billingInfo.lastName
    }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span>${order.billingInfo.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span>${order.billingInfo.phone}</span>
                        </div>
                        ${
                          order.billingInfo.address
                            ? `
                        <div class="info-row">
                            <span class="info-label">Address:</span>
                            <span>${order.billingInfo.address}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="section">
                    <h3>📋 Order Summary</h3>
                    <div class="order-items">
                        ${order.cart
                          .map(
                            (item) => `
                            <div class="item">
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-quantity">Quantity: ${
                                      item.quantity
                                    }</div>
                                </div>
                                <div class="item-price">₹${(
                                  item.price * item.quantity
                                ).toLocaleString()}</div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                <!-- Total -->
                <div class="total-section">
                    <h3>💰 Order Total</h3>
                    <div class="total-amount">₹${order.total.toLocaleString()}</div>
                    <p>Payment Method: ${
                      order.paymentMethod || "Not specified"
                    }</p>
                </div>
                
                <!-- Thank You Message -->
                <div class="thank-you">
                    <p><span class="emoji">🙏</span><strong>Thank you for choosing Shushi Restaurant!</strong></p>
                    <p>We're preparing your delicious meal with care. You'll receive updates as your order progresses.</p>
                    <p><strong>Estimated Delivery/Pickup:</strong> ${
                      order.estimatedTime || "30-45 minutes"
                    }</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>Shushi Restaurant</strong></p>
                <p>Authentic Japanese Cuisine</p>
                <div class="contact-info">
                    <p>📍 123 Food Street, Bhopal, MP</p>
                    <p>📞 +91-7762944107 | 🌐 https://shushi2.vercel.app/</p>
                    <p>📧 contact@shushirestaurant.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `,
  };

  await transporter.sendMail(mailOptions);
}
