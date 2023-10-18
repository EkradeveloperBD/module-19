import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function DELETE(request, response) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");
  try {
    const deleteUser = prismaClient.user.delete({
      where: { id: id },
    });

    const result = await prismaClient.$transaction([deleteUser]);

    return await NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "failed", data: error.toString() });
  }
}
