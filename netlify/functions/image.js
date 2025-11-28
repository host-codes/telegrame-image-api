exports.handler = async function(event, context) {
  const { quote = 'Inspirational Quote', author = 'Author', day = '1', gradient = '667eea,764ba2' } = event.queryStringParameters;
  
  try {
    // Create a simple image using canvas API (server-side compatible)
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');

    // Parse gradient colors
    const [color1, color2] = gradient.split(',');
    
    // Create gradient
    const gradientBg = ctx.createLinearGradient(0, 0, 600, 400);
    gradientBg.addColorStop(0, `#${color1}`);
    gradientBg.addColorStop(1, `#${color2}`);
    
    // Draw background
    ctx.fillStyle = gradientBg;
    ctx.fillRect(0, 0, 600, 400);
    
    // Add white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 596, 396);
    
    // Text styles
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    
    // Draw quote
    ctx.font = 'bold 24px Arial';
    wrapText(ctx, `"${quote}"`, 300, 150, 500, 30);
    
    // Draw author
    ctx.font = 'italic 18px Arial';
    ctx.fillText(`- ${author}`, 300, 250);
    
    // Add watermark
    ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.font = '10px Arial';
    ctx.fillText(`QuizPulse-2025-IMG-${String(day).padStart(3, '0')}`, 520, 390);
    
    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
    
  } catch (error) {
    // Fallback: Use a reliable external service
    const [color1, color2] = gradient.split(',');
    const externalUrl = `https://og-maker.vercel.app/api/image?text=${encodeURIComponent(`"${quote}"`)}&subtext=${encodeURIComponent(`- ${author}`)}&width=600&height=400&background=linear-gradient(135deg,#${color1},#${color2})&color=000000`;
    
    const fetch = require('node-fetch');
    const response = await fetch(externalUrl);
    const buffer = await response.buffer();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  }
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  
  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}