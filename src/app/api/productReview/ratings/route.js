import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request, response) {
  const { searchParams } = new URL(request.url);
  let productId = searchParams.get("id");
  try {
    const productReview = prismaClient.product.findMany({
      where: { id: productId },
      include: {
        productsReview: true,
      },
    });

    const getRatings = prismaClient.productReview.aggregate({
      _avg: { rating: true },
      where: { productId: productId },
    });

    const result = await prismaClient.$transaction([productReview, getRatings]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
