uniform sampler2D positions; // Data Texture containing original positions
uniform float uTime;
uniform float uSpeed;
uniform float uCurlFreq;
uniform vec2 uMouse;
uniform float uNumBranches;
uniform float uBranchDepth;
uniform float uSharpness;
uniform float uBlobRadius;
uniform float uBlobNoiseScale;
uniform float uBlobNoiseAmount;
uniform float uRotationTorus;
// uniform float uRotationTorus2;
varying vec2 vUv;

#define PI 3.1415926538

#pragma glslify: curl = require(glsl-curl-noise)
#pragma glslify: noise = require(glsl-noise/classic/3d)

float random(float n) {
    return fract(sin(n) * 43758.5453123);
}

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

vec3 slideOnSurface(vec3 pos, float time) {
    // On garde la même distance au centre (reste sur la surface)
    float radius = length(pos);
    vec3 normalizedPos = normalize(pos);
    
    // Créer un déplacement linéaire
    vec2 direction = vec2(1.0, 0.5); // Direction du déplacement
    float speed = 1.0;
    
    // Déplacer le point dans l'espace tangent à la surface
    vec3 tangent = normalize(cross(normalizedPos, vec3(0.0, 1.0, 0.0)));
    vec3 bitangent = normalize(cross(normalizedPos, tangent));
    
    // Appliquer le déplacement
    vec2 offset = direction * time * speed;
    vec3 displaced = normalizedPos + 
                    tangent * offset.x + 
                    bitangent * offset.y;
    
    // Renormaliser pour rester sur la surface
    return normalize(displaced) * radius;
}

vec3 sphereToStar(vec3 pos, float numBranches, float branchDepth, float sharpness) {
    pos = normalize(pos);
    float radius = length(pos);
    float theta = atan(pos.y, pos.x);
    float phi = acos(pos.z / radius);
    
    float horModulation = pow(abs(sin(numBranches * 0.5 * theta)), 0.5);
    float vertModulation = pow(abs(sin(numBranches * phi)), 0.5);
    
    horModulation = pow(horModulation, sharpness);
    vertModulation = pow(vertModulation, sharpness);
    
    float starRadius = radius * (1.0 - branchDepth + branchDepth * (horModulation * vertModulation));
    
    return pos * starRadius;
}

vec3 sphereToCube(vec3 pos) {
    vec3 p = normalize(pos);
    vec3 absp = abs(p);
    float max = max(max(absp.x, absp.y), absp.z);
    return p * (1.0/max);
}

vec3 twist(vec3 pos, float amount) {
    float c = cos(amount * pos.y);
    float s = sin(amount * pos.y);
    mat2 m = mat2(c, -s, s, c);
    vec3 twisted = vec3(m * pos.xz, pos.y);
    return twisted;
}



float smoothSquareWave(float t, float smoothness) {
    // Créer une onde en dents de scie basique
    float sawWave = fract(t * 0.5);  // fract donne la partie fractionnaire (0 à 1)
    
    // Utiliser smoothstep pour créer les transitions douces
    // smoothstep(edge0, edge1, x) fait une interpolation douce entre 0 et 1
    float transition = 0.5 * smoothness;  // Largeur de la zone de transition
    return smoothstep(0.5 - transition, 0.5 + transition, sawWave);
}

// Fonction pour créer une sphère
vec3 createSphere(vec3 pos, float radius) {
    return normalize(pos) * radius;
}

// Fonction pour créer un cube
vec3 createCube(vec3 pos, float size) {
    vec3 p = normalize(pos);
    vec3 absp = abs(p);
    float max = max(max(absp.x, absp.y), absp.z);
    return p * (size/max);
}

vec3 createCone(vec3 pos, float height, float radius, vec3 offset) {
    pos -= offset; // Déplacer le centre du cône
    float r = length(pos.xz);
    float h = pos.y;
    float angle = atan(radius, height);
    vec3 normalized = normalize(pos);
    return normalized * length(pos) * smoothstep(angle, angle - 0.1, acos(normalized.y)) + offset;
}

// Fonction helper pour le bruit 3D
float random3D2(vec3 pos) {
    return fract(sin(dot(pos.xyz, vec3(12.9898, 78.233, 45.5432))) * 43758.5453123);
}

vec3 createDesertRose(vec3 pos, float numPetals, float roughness, float scale, vec3 offset) {
    pos -= offset;
    
    // Convertir en coordonnées sphériques
    float radius = length(pos);
    float theta = atan(pos.y, pos.x);
    float phi = acos(pos.z / radius);
    
    // Créer la forme de base (pétales)
    float petalPattern = abs(sin(numPetals * 0.5 * theta) * sin(numPetals * phi));
    
    // Ajouter de la variation aléatoire pour l'aspect cristallin
    float noise = random3D2(pos * roughness);
    petalPattern = pow(petalPattern, 1.0 + noise);
    
    // Moduler le rayon
    float newRadius = radius * (0.5 + 0.5 * petalPattern) * scale;
    
    // Reconvertir en coordonnées cartésiennes
    pos = normalize(pos) * newRadius;
    
    return pos + offset;
}

vec3 createFlow(vec3 pos, float time, float speed) {
    // Déplacement de base de droite à gauche
    pos.x -= time * speed;
    
    // Réinitialiser la position quand les particules vont trop à gauche
    if (pos.x < -2.0) {
        pos.x = 2.0;
        // Ajouter un peu de variation aléatoire en y et z
        pos.y += (random(pos.x + pos.y) - 0.5) * 0.5;
        pos.z += (random(pos.x + pos.z) - 0.5) * 0.5;
    }
    
    // Ajouter un peu de mouvement ondulant
    pos.y += sin(time + pos.x * 2.0) * 0.1;
    pos.z += cos(time + pos.x * 2.0) * 0.1;
    
    return pos;
}



vec3 createCylinder(vec3 pos, float height, float radius, vec3 offset) {
    pos -= offset; // Déplacer le centre du cylindre
    vec2 xz = pos.xz;
    float r = length(xz);
    pos.xz *= radius / max(r, radius);
    pos.y = clamp(pos.y, -height/2.0, height/2.0);
    return pos + offset;
}

vec3 combineShapes(vec3 pos) {
    // Positions des formes dans l'espace
    vec3 coneOffset = vec3(2.0, 0.0, 0.0);    // Cône à droite
    vec3 cylinderOffset = vec3(-2.0, 0.0, 0.0); // Cylindre à gauche
    
    // Créer les formes
    vec3 cone = createCone(pos, 1.5, 0.8, coneOffset);
    vec3 cylinder = createCylinder(pos, 2.0, 0.6, cylinderOffset);
    
    // Déterminer quelle forme est la plus proche du point
    float distToCone = length(pos - coneOffset);
    float distToCylinder = length(pos - cylinderOffset);
    
    // Retourner la forme la plus proche
    return distToCone < distToCylinder ? cone : cylinder;
}

float map(float value, float a, float b, float c, float d) {
    return c + (value - a) * (d - c) / (b - a);
  }



float random3D(vec3 pos) {
    return fract(sin(dot(pos.xyz, vec3(12.9898, 78.233, 45.5432))) * 43758.5453123);
}

vec3 createFlatDisk(vec3 pos, float radius, float thickness) {
    // Distance au plan XZ (hauteur)
    float distToPlane = abs(pos.y);
    
    // Masque du disque (basé sur la distance au centre dans le plan XZ)
    float diskMask = step(length(pos.xz), radius) * smoothstep(thickness, 0.0, distToPlane);
    
    // Appliquer la forme
    return pos * (diskMask );
}

vec3 createBlobby(vec3 pos, float radius, float noiseScale, float noiseAmount) {
    // Normaliser la position pour la forme de base
    float dist = length(pos);
    vec3 normalized = normalize(pos);
    
    // Créer plusieurs couches de bruit pour la déformation
    float noise1 = noise(normalized * noiseScale);
    float noise2 = noise(normalized * noiseScale * 2.0) * 0.5;
    float noise3 = noise(normalized * noiseScale * 4.0) * 0.25;
    
    // Combiner les bruits pour créer une déformation organique
    float totalNoise = (noise1 + noise2 + noise3) * noiseAmount;
    
    // Appliquer la déformation à la sphère de base
    float newRadius = radius * (1.0 + totalNoise);
    
    return normalized * newRadius;
}

vec3 createTorus(vec3 pos, float majorRadius, float minorRadius) {
    // Normaliser la position
    vec3 p = normalize(pos);
    
    // Convertir en coordonnées cylindriques
    float r = length(p.xz);
    float theta = atan(p.z, p.x);
    
    // Calculer la position sur le tore
    vec3 torusPos = vec3(
        (majorRadius + minorRadius * cos(theta)) * cos(theta),
        minorRadius * sin(theta),
        (majorRadius + minorRadius * cos(theta)) * sin(theta)
    );
    
    return torusPos;
}

// vec3 createHourglass(float t, vec3 pos, float height, float radius, float waistRadius) {
//     // Normaliser la position
//     float y = pos.y;
    
//     // Séparer en deux cônes
//     if (y > 0.0) {
//         // Cône supérieur (inversé)
//         float ratio = (height/2.0 - y) / (height/2.0);
//         float currentRadius = mix(waistRadius, radius, ratio);
//         vec2 xz = pos.xz;
//         float r = length(xz);
//         if (r > 0.0) {
//             pos.xz *= currentRadius / r;
//         }
//     } else {
//         // Cône inférieur
//         float ratio = (y + height/2.0) / (height/2.0);
//         float currentRadius = mix(radius, waistRadius, ratio);
//         vec2 xz = pos.xz;
//         float r = length(xz);
//         if (r > 0.0) {
//             pos.xz *= currentRadius / r;
//         }
//     }
    
//     // Ajouter un peu de mouvement pour simuler le sable
//     float noise = curl(pos * 5.0 + t * 0.1) * 0.1;
//     pos.xz += noise;
    
//     return pos;
// }
vec3 createTube(vec3 pos, float tubeRadius, float sectionRadius, float uRotationTorus) {
    // Normaliser la position
    vec3 p = normalize(pos);
    
    // Convertir en coordonnées polaires
    float r = length(p.xz);
    float theta = atan(p.z, p.x);
    
    // Calculer la position sur le tube
    vec3 center = vec3(
        tubeRadius * cos(theta),
        0.0,
        tubeRadius * sin(theta)
    );
    
    // Calculer la position relative au centre du tube
    vec3 toCenter = p - center;
    
    // Rotation autour de l'axe du tube
    float rotationAngle = uRotationTorus * 20.0; // Vitesse de rotation
    vec3 tangent = vec3(-sin(theta), 0.0, cos(theta)); // Direction du tube
    vec3 rotated = rotate(toCenter, tangent, 1.0);
    
    // Appliquer le rayon de la section
    rotated = normalize(rotated) * sectionRadius;
    
    // Position finale sur la surface du tube
    vec3 tubePos = center + rotated;
    
    // Rotation finale de tout le tore autour de l'axe Z
    tubePos = rotate(tubePos, vec3(0.0, 0.0, 1.0), uRotationTorus);
    
    return tubePos;
}
void main() {
  float t = uTime * 0.15 * uSpeed;

  vec2 uv = vUv;

  vec3 pos = texture2D(positions, uv).rgb; // basic simulation: displays the particles in place.
  vec3 curlPos = texture2D(positions, uv).rgb;
  vec3 cubepos = texture2D(positions, uv).rgb;
  vec3 finalPos = vec3(0.0);

  // Calculer la direction vers la souris
  vec3 mousePos = vec3(uMouse.x, uMouse.y, 0.0) * 2.0; // Ajuster l'échelle si nécessaire
  vec3 toMouse = mousePos - pos;
  float distToMouse = length(toMouse);
  
  // Force d'attraction vers la souris
  float mouseInfluence = smoothstep(2.0, 0.0, distToMouse) * 0.3; // Ajuster ces valeurs
  // pos += normalize(toMouse) * mouseInfluence ;

  // pos = normalize(pos);

//   pos = slideOnSurface(pos, t);
  
  // Utiliser la fonction de combinaison
  // pos = combineShapes(pos);
  pos=curl(pos * 2.0 * uCurlFreq + t);
  cubepos=curl(cubepos * 2.0 * uCurlFreq + t);

  // pos += normalize(toMouse) * mouseInfluence ;
  // cubepos += normalize(toMouse) * mouseInfluence ;
  // pos += curl(curlPos * uCurlFreq * 2.0) * 1.0; 
  // pos += curl(curlPos * uCurlFreq * 4.0) * 0.25; 
  // cubepos = curl(cubepos * uCurlFreq + t);
  // cubepos = normalize(cubepos) * length(pos);
//   float repulsionRadius = 0.1;
//   float repulsionStrength = 0.05;
//   vec3 repulsion = normalize(cubepos) * repulsionStrength * 
//                    (1.0 - smoothstep(0.0, repulsionRadius, length(cubepos)));
//   cubepos += repulsion;
  // curlPos = pos;
  // cubepos = curl(cubepos * uCurlFreq + t);
  // cubepos += curl(cubepos * uCurlFreq * 2.0) * 0.5;    // Plus haute fréquence
  // cubepos += curl(cubepos * uCurlFreq * 4.0) * 0.25;   // Encore plus haute fréquence

  // cubepos = sphereToStar(cubepos, uNumBranches, uBranchDepth, uSharpness);
  
  // cubepos = createDesertRose(cubepos, 10.0, 0.1, 1.0, vec3(0.0));
  // cubepos = createFlatDisk(cubepos, 1.0, 0.1);
  cubepos = createBlobby(cubepos, 1.0, 3.0, 0.5);
  // Move the particles here
  // pos = rotate(pos, vec3(0.0, 0.0, 1.0), t + sin(length(pos.xy) * 2.0 + PI * 0.5) * 10.0);
  // pos = rotate(pos, vec3(1.0, 0.0, 0.0), -t);
  // pos.z += tan(length(length(pos.xy) * 10.0) - t) * 1.0;
  // pos = curl(pos * uCurlFreq + t);

  // curlPos = curl(curlPos * uCurlFreq + t);
  // if you uncomment the next noise additions
  // you'll get very pleasing flocking particles
  // inside the bounds of a sphere
  // curlPos += curl(curlPos * uCurlFreq * 2.0) * 0.5;
  // curlPos += curl(curlPos * uCurlFreq * 4.0) * 0.25;
  // curlPos += curl(curlPos * uCurlFreq * 8.0) * 0.125;
  // curlPos += curl(pos * uCurlFreq * 16.0) * 0.0625;

  float smoothness = 0.3;  // Plus petit = transitions plus abruptes
//   float wave = smoothSquareWave(3.0*t, smoothness);
  if (uTime < 1.0) {
    pos = mix(pos*0.5, pos*(4.0 +3.0 *random3D(pos)), 1.0 - uTime);
  }

  // float animationProgress = clamp((uTime - 1.0) / 2.0, 0.0, 1.0);
  
  

  if (uTime > 1.0 && uTime < 3.0) {
    pos = mix(pos*0.5, pos*1.0, map(uTime, 1.0, 3.0, 0.0, 1.0));
  }

  

    
  // vec3 torusPos = createTorus(pos, 1.0, 0.5); // majorRadius = 1.0, minorRadius = 0.3
  // vec3 torusPos = createCylinder(pos, 1.0, 0.1, vec3(0.0));
  // vec3 torusPos = createHourglass(t,pos, 1.0, 0.3, 0.3);
  // finalPos = mix(pos, cubepos, abs(sin((t+4.0)*4.0)));
  // finalPos = pos ;
  // finalPos= pos + normalize(toMouse) * mouseInfluence;
  vec3 tubePos = createTube(pos, 1.0, 0.1,uRotationTorus);
    
 

  gl_FragColor = vec4(tubePos, 1.0);
}