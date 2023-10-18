import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request, response) {
  const { searchParams } = new URL(request.url);
  let userId = searchParams.get("id");
  try {
    const orderByUser = prismaClient.user.findFirst({
      where: { id: userId },
      include: {
        orders: true,
      },
    });

    const getTotalOrder = prismaClient.order.aggregate({
      _sum: { grandTotal: true },
      where: { userId: userId },
    });

    const result = await prismaClient.$transaction([
      orderByUser,
      getTotalOrder,
    ]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
