precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform vec3 u_tint;
uniform float u_vignette;
uniform float u_vibrance;

varying vec2 v_texCoord;

// RGB to HSL
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 color = texture2D(u_texture, v_texCoord);
    vec3 rgb = color.rgb;
    
    // Brightness
    rgb += u_brightness / 100.0;
    
    // Contrast
    rgb = (rgb - 0.5) * (1.0 + u_contrast / 100.0) + 0.5;
    
    // Saturation & Vibrance
    float luminance = dot(rgb, vec3(0.299, 0.587, 0.114));
    
    // Vibrance (increase saturation of less saturated colors)
    float maxColor = max(rgb.r, max(rgb.g, rgb.b));
    float minColor = min(rgb.r, min(rgb.g, rgb.b));
    float colorSat = maxColor - minColor;
    float vibranceAmount = u_vibrance / 100.0 * (1.0 - colorSat);
    rgb = mix(rgb, vec3(maxColor), -vibranceAmount); // Rough vibrance
    
    // Standard Saturation
    rgb = mix(vec3(luminance), rgb, 1.0 + u_saturation / 100.0);
    
    // Tint
    rgb *= u_tint;
    
    // Vignette
    float dist = distance(v_texCoord, vec2(0.5));
    float vign = 1.0 - smoothstep(0.4, 0.8, dist) * (u_vignette / 100.0);
    rgb *= vign;
    
    gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
}
