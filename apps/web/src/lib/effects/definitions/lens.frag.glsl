precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_distortion;
uniform float u_vignette;

varying vec2 v_texCoord;

void main() {
    float distortion = u_distortion * 0.1;
    vec2 uv = v_texCoord - 0.5;
    
    // Lens distortion formula
    float r2 = dot(uv, uv);
    vec2 distortedUV = uv * (1.0 + distortion * r2);
    distortedUV += 0.5;
    
    // Check if within bounds
    if (distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    vec4 color = texture2D(u_texture, distortedUV);
    
    // Vignette
    float dist = distance(v_texCoord, vec2(0.5));
    float vign = 1.0 - smoothstep(0.4, 0.8 / (0.1 + u_vignette / 100.0), dist);
    color.rgb *= vign;
    
    gl_FragColor = color;
}
