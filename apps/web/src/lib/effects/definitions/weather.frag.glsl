precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;
uniform float u_speed;

varying vec2 v_texCoord;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float time = u_time * (u_speed / 100.0) * 0.5;
    vec2 uv = v_texCoord;
    
    // Create parallax rain streaks
    vec2 streakUV = uv * vec2(1.0, 0.1) + vec2(0.0, time);
    float streakNoise = rand(floor(streakUV * 100.0));
    
    float streak = smoothstep(0.9, 1.0, streakNoise);
    
    // Randomize length/vertical motion slightly more
    float grain = rand(uv + time);
    
    vec4 color = texture2D(u_texture, uv);
    
    // Add bright streaks
    color.rgb += (streak * (u_intensity / 100.0) * grain * 0.4);
    
    // Desaturate slightly for rainy look
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(color.rgb, vec3(gray), (u_intensity / 100.0) * 0.2);
    
    gl_FragColor = color;
}
