import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lab 4: DELETE /inventory/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Challenge: Check quantity before deletion
    const product = await prisma.product.findUnique({
      where: { id },
      select: { quantity: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.quantity > 0) {
      return NextResponse.json(
        { error: 'ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
