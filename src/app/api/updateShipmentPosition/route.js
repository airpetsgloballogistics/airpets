import Shipmenttwo from "@/models/Shipmenttwo";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { trackingNumber, position, currentStep } = await req.json();

    if (
      !trackingNumber ||
      !Array.isArray(position) ||
      position.length !== 2 ||
      typeof currentStep !== "number"
    ) {
      return new NextResponse(JSON.stringify({ message: "Invalid input" }), {
        status: 400,
      });
    }

    console.log(
      `Updating position for tracking number: ${trackingNumber} to ${position} with step ${currentStep}`
    );
    await dbConnect();

    const shipment = await Shipmenttwo.findOneAndUpdate(
      { trackingNumber },
      { currentPosition: position, currentStep },
      { new: true }
    );

    if (!shipment) {
      return new NextResponse(
        JSON.stringify({ message: "Shipment not found" }),
        { status: 404 }
      );
    }

    console.log(`Updated shipment: ${JSON.stringify(shipment)}`);
    return new NextResponse(
      JSON.stringify({
        status: shipment.status,
        position: shipment.currentPosition,
        currentStep: shipment.currentStep,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating shipment position:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
