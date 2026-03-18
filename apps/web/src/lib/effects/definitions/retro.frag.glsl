precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_pixelSize;
uniform float u_scanlineIntensity;

varying vec2 v_texCoord;

void main() {
    float pixelSize = max(1.0, u_pixelSize);
    vec2 resSize = u_resolution / pixelSize;
    vec2 pixelUV = floor(v_texCoord * resSize) / resSize;
    
    vec4 color = texture2D(u_texture, pixelUV);
    
    // Scanlines
    float scanline = sin(v_texCoord.y * u_resolution.y * 1.5) * 0.5 + 0.5;
    color.rgb *= 1.0 - (scanline * (u_scanlineIntensity / 100.0) * 0.3);
    
    // Retro color crush (minimal)
    color.rgb = floor(color.rgb * 16.0) / 16.0;
    
    gl_FragColor = color;
}
