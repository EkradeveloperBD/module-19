import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request, response) {
  const { searchParams } = new URL(request.url);
  let categoryId = searchParams.get("id");
  try {
    const productByCategory = prismaClient.category.findFirst({
      where: { id: categoryId },
      include: {
        products: true,
      },
    });

    const getTotalProduct = prismaClient.product.groupBy({
      by: ["categoryId"],
      _count: { id: true },
      where: { categoryId: categoryId },
    });

    const result = await prismaClient.$transaction([
      productByCategory,
      getTotalProduct,
    ]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
