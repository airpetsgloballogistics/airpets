import Shipmenttwo from "@/models/Shipmenttwo";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req, res) => {
  try {
    await dbConnect();

    const { trackingNumber, updatedData } = await req.json();
    console.log("Received update request for:", trackingNumber);
    // console.log("Update data:", updatedData);

    const shipment = await Shipmenttwo.findOne({ trackingNumber });

    if (!shipment) {
      return new NextResponse(
        JSON.stringify({ message: "Shipment not found" }),
        { status: 404 }
      );
    }

    const originalStatus = shipment.status;
    Object.assign(shipment, updatedData);
    await shipment.save();
    console.log("Shipment updated successfully");

    if (originalStatus !== updatedData.status) {
      console.log(
        "Status changed from",
        originalStatus,
        "to",
        updatedData.status
      );

      try {
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

        const currentDate = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Generate a unique Message-ID
        const messageId = `${Date.now()}.${Math.random()
          .toString(36)
          .substring(2)}@airpetsglobal.com`;

        let mailOptions = {
          from: {
            name: "AIRPETS GLOBAL LOGISTICS", // More specific sender name
            address: "airpetsgloballogistics@gmail.com",
          },
          to: shipment.receiverEmail,
          cc: "airpetsgloballogistics@gmail.com",
          subject: `Important: Your Shipment ${trackingNumber} Status Has Changed to ${updatedData.status}`,
          messageId: messageId,
          // Add DKIM-friendly headers
          headers: {
            "X-Entity-Ref-ID": messageId,
            "List-Unsubscribe": `<mailto:airpetsgloballogistics@gmail.com?subject=unsubscribe_${trackingNumber}>`,
            "Feedback-ID": `${trackingNumber}:airpetsglobal:${Date.now()}`,
          },
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Shipment Status Update</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1a237e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">AIRPETS GLOBAL LOGISTICS SHIPPING</h1>
                </div>

                <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
                  <p style="margin-bottom: 20px;">Dear ${shipment.receiver},</p>
                  
                  <p style="margin-bottom: 15px;">This is an important update regarding your shipment.</p>

                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #1a237e; margin-top: 0; font-size: 18px;">Status Change Alert</h2>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                      <li style="margin-bottom: 10px;">📦 Tracking Number: <strong>${trackingNumber}</strong></li>
                      <li style="margin-bottom: 10px;">🔄 Previous Status: <strong>${originalStatus}</strong></li>
                      <li style="margin-bottom: 10px;">✨ New Status: <strong>${
                        updatedData.status
                      }</strong></li>
                      ${
                        updatedData.comments
                          ? `<li style="margin-bottom: 10px;">📝 Update Details: ${updatedData.comments}</li>`
                          : ""
                      }
                      <li>🕒 Updated: ${currentDate}</li>
                    </ul>
                  </div>

                  <div style="margin-bottom: 25px;">
                    <h3 style="color: #1a237e; font-size: 16px;">Shipping Details:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; width: 100px;">From:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
                          shipment.senderAddress || "N/A"
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">To:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
                          shipment.receiverAddress || "N/A"
                        }</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${
                      process.env.NEXT_PUBLIC_BASE_URL
                    }/shipment?num=${trackingNumber}" 
                       style="background-color: #1a237e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                       Track Your Shipment
                    </a>
                  </div>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin-bottom: 10px;">Best regards,</p>
                    <p style="margin-bottom: 20px;"><strong>FASTLANEGLOBAL Shipping Team</strong></p>
                  </div>

                  <div style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
                    <p>This is a transactional email regarding your shipment status update.</p>
                    <p>© ${new Date().getFullYear()} AIRPETS GLOBAL LOGISTICS. All rights reserved.</p>
                    <p>If you need assistance, please contact our <a href="mailto:airpetsgloballogistics@gmail.com" style="color: #1a237e;">customer service</a>.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
            AIRPETS GLOBAL LOGISTICS
            
            Dear ${shipment.receiver},
            
            Your shipment status has been updated.
            
            Tracking Number: ${trackingNumber}
            Previous Status: ${originalStatus}
            New Status: ${updatedData.status}
            ${
              updatedData.comments
                ? `Update Details: ${updatedData.comments}`
                : ""
            }
            Updated: ${currentDate}
            
            From: ${shipment.senderAddress || "N/A"}
            To: ${shipment.receiverAddress || "N/A"}
            
            Track your shipment at: ${
              process.env.NEXT_PUBLIC_BASE_URL
            }/shipment?num=${trackingNumber}
            
            Best regards,
            AIRPETS GLOBAL LOGISTICS Shipping Team
          `,
        };

        console.log("Verifying SMTP connection...");
        await transporter.verify();

        console.log("Sending email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
      } catch (emailError) {
        console.error("Email error:", emailError);
        console.error("Email configuration:", {
          user: process.env.EMAIL_USER,
          receiverEmail: shipment.receiverEmail,
          senderEmail: shipment.senderEmail,
        });
      }
    }

    return new NextResponse(JSON.stringify({ shipmentData: shipment }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
