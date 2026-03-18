precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;

varying vec2 v_texCoord;

void main() {
    float amount = u_amount * 0.05;
    
    vec4 r = texture2D(u_texture, v_texCoord + vec2(amount, 0.0));
    vec4 g = texture2D(u_texture, v_texCoord);
    vec4 b = texture2D(u_texture, v_texCoord - vec2(amount, 0.0));
    
    gl_FragColor = vec4(r.r, g.g, b.b, g.a);
}
