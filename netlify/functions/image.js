const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { quote = 'Inspirational Quote', author = 'Author', day = '1', gradient = '667eea,764ba2' } = event.queryStringParameters;
  
  try {
    // Use a reliable external image service
    const [color1, color2] = gradient.split(',');
    
    // Using a service that definitely works
    const imageUrl = `https://og-maker.vercel.app/api/image?text=${encodeURIComponent(`"${quote}"`)}&subtext=${encodeURIComponent(`- ${author}`)}&width=600&height=400&background=linear-gradient(135deg,#${color1},#${color2})&color=000000`;
    
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const imageBuffer = await response.buffer();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400'
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true
    };
    
  } catch (error) {
    // Ultimate fallback - use placeholder
    const [color1, color2] = gradient.split(',');
    const fallbackUrl = `https://via.placeholder.com/600x400/${color1}/${color2}.png?text=${encodeURIComponent(`"${quote}" - ${author}`)}`;
    
    const response = await fetch(fallbackUrl);
    const imageBuffer = await response.buffer();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png'
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true
    };
  }
};
