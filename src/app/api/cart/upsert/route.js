import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function POST(request, response) {
  console.log("Curren Date: ", new Date().toISOString());
  try {
    const requestBody = await request.json();
    const id = requestBody.id ? requestBody.id : 0;
    const createCart = prismaClient.cart.upsert({
      where: { id: id },
      update: requestBody,
      create: requestBody,
    });

    const result = await prismaClient.$transaction([createCart]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
