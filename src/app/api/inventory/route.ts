import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// Lab 2 Challenge: TypeBox Validation Schema
const CreateProductSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  sku: Type.String({ minLength: 1 }),
  quantity: Type.Optional(Type.Number({ default: 0 })),
  zone: Type.String({ minLength: 1 }),
});

// Lab 1: GET /inventory
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lowStock = searchParams.get('low_stock') === 'true';

  try {
    const products = await prisma.product.findMany({
      where: lowStock ? { quantity: { lte: 10 } } : {},
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch inventory', details: error.message }, { status: 500 });
  }
}

// Lab 2: POST /inventory
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Challenge: TypeBox Validation
    if (!Value.Check(CreateProductSchema, body)) {
      const errors = [...Value.Errors(CreateProductSchema, body)];
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // Apply defaults using Value.Cast
    const validatedData = Value.Cast(CreateProductSchema, body);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        sku: validatedData.sku,
        quantity: validatedData.quantity ?? 0,
        zone: validatedData.zone,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'SKU must be unique' }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Failed to create product', 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
