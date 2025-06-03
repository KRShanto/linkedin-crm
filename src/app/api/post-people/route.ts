import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ContactStatus } from "@/lib/types";

// Type for the expected webhook payload
type WebhookPayload = {
  name?: string;
  url?: string;
  profileImage?: string;
  location?: string;
  headline?: string;
  about?: string;
  currentPosition?: string;
  currentCompany?: string;
  email?: string;
  phone?: string;
  websites?: string[];
  connected?: boolean;
  connectionDegree?: number;
  status?: ContactStatus;
};

export async function POST(request: NextRequest) {
  try {
    // Check for auth token
    const authToken = request.headers.get("X-TOKEN");
    const expectedToken = process.env.AUTH_X_TOKEN;

    if (!expectedToken) {
      console.error("AUTH_X_TOKEN is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!authToken || authToken !== expectedToken) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Parse the request body
    const payload: WebhookPayload = await request.json();

    console.log("Payload", payload);

    // Validate the payload
    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 }
      );
    }

    // Insert the data into Supabase
    const { data, error } = await supabase
      .from("People")
      .insert([
        {
          name: payload.name,
          url: payload.url,
          profileImage: payload.profileImage,
          location: payload.location,
          headline: payload.headline,
          about: payload.about,
          currentPosition: payload.currentPosition,
          currentCompany: payload.currentCompany,
          email: payload.email,
          phone: payload.phone,
          websites: payload.websites || [],
          connected: payload.connected || false,
          connectionDegree: payload.connectionDegree || 0,
          status: payload.status || ContactStatus.NOT_STARTED,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json(
        { error: "Failed to process webhook data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Webhook processed successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optionally handle GET requests to test if the webhook is up
export async function GET() {
  return NextResponse.json(
    { message: "Webhook endpoint is active" },
    { status: 200 }
  );
} 