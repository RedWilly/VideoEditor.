precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_jitter;

varying vec2 v_texCoord;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float time = u_time * 2.0;
    
    // Jitter coordinates based on time
    vec2 offset = vec2(
        (rand(vec2(time, 0.0)) - 0.5) * (u_jitter / 100.0) * 0.02,
        (rand(vec2(0.0, time)) - 0.5) * (u_jitter / 100.0) * 0.02
    );
    
    vec2 jitteredUV = v_texCoord + offset;
    
    // Clamp to avoid edge artifacts
    jitteredUV = clamp(jitteredUV, 0.001, 0.999);
    
    gl_FragColor = texture2D(u_texture, jitteredUV);
}
