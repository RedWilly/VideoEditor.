precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_edgeIntensity;
uniform float u_posterizeLevels;

varying vec2 v_texCoord;

void main() {
    float edgeIntensity = (u_edgeIntensity / 100.0) * 0.1;
    float posterizeLevels = max(2.0, u_posterizeLevels);
    
    vec2 texelSize = 1.0 / u_resolution;
    
    vec4 c = texture2D(u_texture, v_texCoord);
    
    // Sobel-like edge detection (simplified)
    vec4 t = texture2D(u_texture, v_texCoord + vec2(0.0, texelSize.y));
    vec4 b = texture2D(u_texture, v_texCoord - vec2(0.0, texelSize.y));
    vec4 l = texture2D(u_texture, v_texCoord - vec2(texelSize.x, 0.0));
    vec4 r = texture2D(u_texture, v_texCoord + vec2(texelSize.x, 0.0));
    
    float edge = length(t - b) + length(r - l);
    
    // Smooth out edge
    edge = smoothstep(0.05, 0.2, edge);
    
    // Apply edges
    vec3 result = c.rgb;
    result -= edge * edgeIntensity * 20.0;
    
    // Posterize
    result = floor(result * posterizeLevels) / posterizeLevels;
    
    gl_FragColor = vec4(result, c.a);
}
