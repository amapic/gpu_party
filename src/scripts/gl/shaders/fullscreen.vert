varying vec2 vUv;
uniform vec2 uMouse;

void main() {
  vUv = uv;

  // Calcul de la distance entre le vertex et la souris
  // float dist = distance(uv, uMouse);

  // Déplacement du vertex en fonction de la distance
  // vec3 newPosition = position;
  // newPosition.x += sin(dist * 10.0) * 1.0;
  // newPosition.y += cos(dist * 10.0) * 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}