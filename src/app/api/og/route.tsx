import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'BaseTime Event';
    const date = searchParams.get('date') || '';
    const image = searchParams.get('image') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, #0052ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00d4ff 0%, transparent 50%)',
              opacity: 0.1,
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              maxWidth: '1200px',
              width: '100%',
            }}
          >
            {/* Event Image */}
            {image && (
              <div
                style={{
                  width: '400px',
                  height: '200px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '40px',
                  border: '2px solid #0052ff',
                }}
              >
                <img
                  src={image}
                  alt="Event"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Event Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: 1.2,
                maxWidth: '800px',
              }}
            >
              {title}
            </div>

            {/* Event Date */}
            {date && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#00d4ff',
                  textAlign: 'center',
                  marginBottom: '40px',
                }}
              >
                {date}
              </div>
            )}

            {/* BaseTime Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: '#0052ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                📅
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                BaseTime
              </div>
            </div>

            {/* Call to Action */}
            <div
              style={{
                fontSize: '20px',
                color: '#00d4ff',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              RSVP on BaseTime
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
