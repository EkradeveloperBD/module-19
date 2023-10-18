import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request, response) {
  try {
    const findAllCategories = prismaClient.category.findMany();

    const result = await prismaClient.$transaction([findAllCategories]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
