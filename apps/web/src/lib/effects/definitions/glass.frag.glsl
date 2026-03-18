precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_distortion;
uniform float u_noiseScale;

varying vec2 v_texCoord;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float distortion = u_distortion * 0.02;
    float noiseScale = max(1.0, u_noiseScale);
    
    // Low frequency noise for smooth glass distortion
    vec2 floorUV = floor(v_texCoord * noiseScale) / noiseScale;
    float noiseValue = rand(floorUV);
    
    vec2 offset = vec2(
        (rand(floorUV + 0.1) - 0.5),
        (rand(floorUV + 0.2) - 0.5)
    ) * distortion;
    
    vec2 glassUV = v_texCoord + offset;
    
    // Sample texture with distortion
    vec4 color = texture2D(u_texture, glassUV);
    
    // Add specular-like highlights
    float highlight = pow(smoothstep(0.4, 0.6, noiseValue), 2.0) * 0.1;
    color.rgb += highlight;
    
    gl_FragColor = color;
}
