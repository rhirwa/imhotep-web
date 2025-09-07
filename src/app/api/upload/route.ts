import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return new NextResponse('No file provided', { status: 400 });

    // 1. Get presigned URL
    const presignedUrlResponse = await fetch(`${API_BASE_URL}/datasets/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type,
      }),
    });

    if (!presignedUrlResponse.ok) {
      const error = await presignedUrlResponse.json();
      console.error('Presigned URL error:', error);
      return new NextResponse('Upload failed', { status: presignedUrlResponse.status });
    }

    const { url, fields, dataset_id } = await presignedUrlResponse.json();

    // 2. Upload to S3
    const formDataForS3 = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formDataForS3.append(key, value as string);
    });
    formDataForS3.append('file', file);

    const uploadResponse = await fetch(url, { method: 'POST', body: formDataForS3 });
    if (!uploadResponse.ok) {
      console.error('S3 upload failed:', await uploadResponse.text());
      return new NextResponse('Upload failed', { status: 500 });
    }

    // 3. Trigger forecast
    const forecastResponse = await fetch(`${API_BASE_URL}/forecasts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ dataset_id }),
    });

    if (!forecastResponse.ok) {
      const error = await forecastResponse.json();
      console.error('Forecast error:', error);
      return new NextResponse('Forecast failed', { status: forecastResponse.status });
    }

    const { job_id } = await forecastResponse.json();
    return NextResponse.json({ job_id });

  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
