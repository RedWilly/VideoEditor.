precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_noiseIntensity;
uniform float u_colorBleed;

varying vec2 v_texCoord;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float time = u_time * 0.1;
    vec2 uv = v_texCoord;
    
    // Add noise
    float noise = rand(uv + floor(time * 30.0));
    
    // Color bleed (slight horizontal blur)
    float bleed = (u_colorBleed / 100.0) * 0.05;
    vec4 color = texture2D(u_texture, uv);
    vec4 colorL = texture2D(u_texture, uv - vec2(bleed, 0.0));
    vec4 colorR = texture2D(u_texture, uv + vec2(bleed, 0.0));
    
    color.r = (color.r + colorL.r) / 2.0;
    color.b = (color.b + colorR.b) / 2.0;

    // Apply grain
    color.rgb += (noise - 0.5) * (u_noiseIntensity / 100.0) * 0.2;
    
    // Slight vignette for analog feel
    float dist = distance(uv, vec2(0.5));
    color.rgb *= (1.0 - smoothstep(0.4, 0.8, dist) * 0.2);
    
    gl_FragColor = color;
}
