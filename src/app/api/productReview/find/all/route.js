import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request, response) {
  try {
    const findAllProductReview = prismaClient.productReview.findMany();

    const result = await prismaClient.$transaction([findAllProductReview]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
