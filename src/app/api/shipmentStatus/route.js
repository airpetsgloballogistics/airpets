import Shipmenttwo from "@/models/Shipmenttwo";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { trackingNumber } = await req.json();
    console.log(trackingNumber);
    await dbConnect();

    const shipment = await Shipmenttwo.findOne({ trackingNumber });

    if (!shipment) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Tracking Number" }),
        { status: 400 }
      );
    }

    console.log(JSON.stringify(shipment));
    return new NextResponse(
      JSON.stringify({
        status: shipment.status,
        position: shipment.currentPosition,
        currentStep: shipment.currentStep, // Include currentStep in the response
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching shipment status:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
