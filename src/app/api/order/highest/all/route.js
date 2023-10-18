import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request, response) {
  try {
    const allUsersOrder = prismaClient.user.findMany({
      include: {
        orders: true,
      },
    });

    const getHighestOrder = prismaClient.order.aggregate({
      _max: { grandTotal: true },
    });

    const result = await prismaClient.$transaction([
      allUsersOrder,
      getHighestOrder,
    ]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
