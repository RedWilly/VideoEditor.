precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_gridScale;
uniform float u_gridIntensity;

varying vec2 v_texCoord;

void main() {
    float gridScale = max(1.0, u_gridScale);
    vec2 gridUV = fract(v_texCoord * gridScale);
    
    // Create grid mask (sharp edges for cleaner look)
    float mask = smoothstep(0.4, 0.5, gridUV.x) * (1.0 - smoothstep(0.5, 0.6, gridUV.x)) +
                 smoothstep(0.4, 0.5, gridUV.y) * (1.0 - smoothstep(0.5, 0.6, gridUV.y));
    
    vec4 color = texture2D(u_texture, v_texCoord);
    
    // Overlay grid
    color.rgb *= 1.0 - (mask * (u_gridIntensity / 100.0) * 0.2);
    
    gl_FragColor = color;
}
