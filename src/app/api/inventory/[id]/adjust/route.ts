import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const AdjustStockSchema = Type.Object({
  change: Type.Number(),
});

// Lab 3: PATCH /inventory/:id/adjust
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!Value.Check(AdjustStockSchema, body)) {
      return NextResponse.json({ error: 'Invalid body, expected { change: number }' }, { status: 400 });
    }

    const { change } = body;

    // Use a transaction or update with increment to ensure consistency
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        quantity: {
          increment: change,
        },
      },
    });

    // Optional: Prevent negative stock if business logic requires it
    if (updatedProduct.quantity < 0) {
       await prisma.product.update({
          where: { id },
          data: { quantity: 0 }
       });
       updatedProduct.quantity = 0;
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 });
  }
}
