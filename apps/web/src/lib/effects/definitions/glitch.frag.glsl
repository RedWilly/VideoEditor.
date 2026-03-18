precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;

varying vec2 v_texCoord;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float time = u_time * 0.1;
    vec2 uv = v_texCoord;
    
    // Create blocky distortion
    float blockSize = 32.0;
    vec2 blockUV = floor(uv * blockSize) / blockSize;
    float blockNoise = rand(blockUV + floor(time * 10.0));
    
    float intensity = u_intensity * 0.05;
    
    if (blockNoise < intensity) {
        uv.x += (rand(vec2(blockUV.y, time)) - 0.5) * intensity;
    }
    
    // RGB Split
    float splitAmount = intensity * 0.5;
    vec4 r = texture2D(u_texture, uv + vec2(splitAmount, 0.0));
    vec4 g = texture2D(u_texture, uv);
    vec4 b = texture2D(u_texture, uv - vec2(splitAmount, 0.0));
    
    gl_FragColor = vec4(r.r, g.g, b.b, g.a);
}
