import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    return NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Failed to submit contact form.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This is the contact API endpoint.' }, { status: 200 });
}