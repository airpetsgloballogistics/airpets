import Shipmenttwo from "@/models/Shipmenttwo";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateNumericId(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const POST = async (req) => {
  try {
    await dbConnect();

    const {
      sender,
      senderEmail,
      senderNumber,
      senderAddress,
      receiver,
      receiverEmail,
      receiverNumber,
      receiverAddress,
      shipmentType,
      weight,
      courier,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      origin,
      destination,
      paymentMethod,
      currentLocation,
      locationUpdateTime,
      pickupDate,
      pickupTime,
      estimatedDeliveryDate,
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight,
      showOnMap = true,
    } = await req.json();

    console.log(
      sender,
      senderEmail,
      senderNumber,
      senderAddress,
      receiver,
      receiverEmail,
      receiverNumber,
      receiverAddress,
      shipmentType,
      weight,
      courier,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      origin,
      destination,
      paymentMethod,
      pickupDate,
      pickupTime,
      estimatedDeliveryDate,
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight
    );

    const trackingNumber = `APLG-${generateNumericId(14)}`;

    const foundShipment = await Shipmenttwo.findOne({ trackingNumber });
    if (foundShipment) {
      return new NextResponse(
        JSON.stringify({ message: "Shipment for this sender already exists" }),
        { status: 400 }
      );
    }

    const newShipment = new Shipmenttwo({
      sender,
      senderEmail,
      senderNumber,
      senderAddress,
      receiver,
      receiverEmail,
      receiverNumber,
      receiverAddress,
      shipmentType,
      weight,
      courier,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      currentLocation,
      locationUpdateTime,
      origin,
      destination,
      paymentMethod,
      pickupDate,
      pickupTime,
      estimatedDeliveryDate,
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight,
      trackingNumber,
      showOnMap,
      status: "Inactive",
      currentPosition: [0, 0],
    });

    await newShipment.save();

    const formattedPickupDate = new Date(pickupDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const formattedDeliveryDate = new Date(
      estimatedDeliveryDate
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Updated Nodemailer configuration with anti-spam settings
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Enhanced mail options with headers for better deliverability
    let mailOptions = {
      from: {
        name: "AIRPETS GLOBAL LOGISTICS",
        address: "airpetsgloballogistics@gmail.com",
      },
      to: receiverEmail,
      cc: "airpetsgloballogistics@gmail.com",
      subject: `Shipment Confirmation - Airpets Global Tracking #${trackingNumber}`,
      priority: "high",
      headers: {
        "Message-ID": `<${Date.now()}@airpetsglobal.com>`,
        "List-Unsubscribe":
          "<mailto:airpetsgloballogistics@gmail.com?subject=unsubscribe>",
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        "X-Mailer": "AIRPETSGLOBAL Mailer",
        Precedence: "bulk",
        "MIME-Version": "1.0",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #1a237e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">AIRPETSGLOBAL</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0;">Shipment Confirmation</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${receiver},</p>
            
            <p style="color: #333; font-size: 16px;">Your shipment has been successfully created and is ready for processing.</p>

            <!-- Tracking Information -->
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1a237e; font-size: 18px; margin-top: 0;">Tracking Information</h2>
              <p style="margin: 10px 0;">Tracking Number: <strong>${trackingNumber}</strong></p>
              <p style="margin: 10px 0;">Status: <strong>Inactive</strong></p>
            </div>

            <!-- Shipment Details -->
            <div style="margin: 20px 0;">
              <h3 style="color: #1a237e; font-size: 16px;">Shipment Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;">Service Type:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${shipmentType}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">Pickup Date:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${formattedPickupDate}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">Expected Delivery:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${formattedDeliveryDate}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">Total Weight:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${weight} kg</strong></td>
                </tr>
              </table>
            </div>

            <!-- Addresses -->
            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
              <div style="flex: 1; padding: 15px; background-color: #f5f5f5; border-radius: 8px; margin-right: 10px;">
                <h4 style="color: #1a237e; margin-top: 0;">From:</h4>
                <p style="margin: 5px 0;">${sender}</p>
                <p style="margin: 5px 0;">${senderAddress}</p>
                <p style="margin: 5px 0;">${senderNumber}</p>
              </div>
              <div style="flex: 1; padding: 15px; background-color: #f5f5f5; border-radius: 8px; margin-left: 10px;">
                <h4 style="color: #1a237e; margin-top: 0;">To:</h4>
                <p style="margin: 5px 0;">${receiver}</p>
                <p style="margin: 5px 0;">${receiverAddress}</p>
                <p style="margin: 5px 0;">${receiverNumber}</p>
              </div>
            </div>

            <!-- Track Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/shipment?num=${trackingNumber}" 
                 style="background-color: #1a237e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Track Your Shipment
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">Thank you for choosing AIRPETSGLOBAL for your shipping needs.</p>
              <p style="color: #666; font-size: 14px;">Best regards,<br>AIRPETSGLOBAL Team</p>
            </div>
          </div>

          <!-- Disclaimer -->
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>If you need assistance, please contact our customer service.</p>
          </div>
        </div>
      `,
    };

    // Enhanced error handling for email sending
    try {
      // Verify SMTP connection first
      await transporter.verify();
      // Send email
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      // Continue with the response even if email fails
    }

    return new NextResponse(JSON.stringify(newShipment), { status: 201 });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
