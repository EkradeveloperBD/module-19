import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function POST(request, response) {
  try {
    const requestBody = await request.json();
    const id = requestBody.id ? requestBody.id : 0;
    const createCategory = prismaClient.category.upsert({
      where: { id: id },
      update: requestBody,
      create: requestBody,
    });

    const result = await prismaClient.$transaction([createCategory]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
