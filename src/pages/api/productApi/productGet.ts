// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret");
    } catch (error) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: product,
      });
    }

    const products = await Product.find();
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}