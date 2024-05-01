// document.addEventListener("DOMContentLoaded", function() {
//     const vertexShaderSource = `
//     attribute vec4 a_position;
//     void main() {
//         gl_Position = a_position;
//     }
//     `;

//     // Define fragment shader
//     const fragmentShaderSource = `
//     precision mediump float;
//     uniform vec2 resolution;
//     uniform float time;

//     const float BIRD_SIZE = 0.01; // Size of the bird
//     const float SUN_RADIUS = 1.0; // Adjust size of the sun
//     const float GLOW_RADIUS = 100.0; // Adjust size of the glow effect
//     const float SHINE_INTENSITY = 100.0;
//     const float SHINE_SPEED = 100.0;

//     // Function to calculate the color of the mountains
//     vec3 calculateMountainColor(vec2 uv) {
//         float mountainY = 0.2 * uv.x + 0.3;
//         float mountain1 = min(uv.y, 0.2 * (1.0 - uv.x) + 0.9);
//         float mountain2 = min(uv.y, 0.2 * (uv.x - 0.5) + 0.9);
//         float mountain3 = min(uv.y, 0.2 * (uv.x + 0.5) + 0.3);
//         float mountain4 = min(uv.y, 0.2 * (-0.5 - uv.x) + 0.3);

//         float minHeight = min(min(mountain1, mountain2), min(mountain3, mountain4));
//         float maxHeight = mountainY + 0.05; // Adjust the height to cover the mountains

//         // Interpolate between light and dark green based on the y-coordinate of the pixel
//         float gradient = smoothstep(minHeight, maxHeight, uv.y);
//         return mix(vec3(0.0, 0.5, 0.0), vec3(0.8, 1.0, 0.2), gradient);
//     }

//     void main() {
//         vec2 uv = gl_FragCoord.xy / resolution.xy;


//         // Calculate sun's position using a sine function for a curved path
//         float t = mod(time, 1.03); // Ensure time repeats every 1 second
//         float sunPositionX = mix(1.0, 0.0, t); // Move from 1.0 (right) to 0.0 (left)
//         float sunPositionY = sin(t * 3.14) * 0.6 + 0.1;


//         // Calculate distance to the sun
//         float distanceToSun = distance(uv, vec2(sunPositionX, sunPositionY));

//         // Create gradient for the sun
//         float sunGradient = smoothstep(SUN_RADIUS, SUN_RADIUS + 0.02, SUN_RADIUS - distanceToSun);

//         // Add glow effect around the sun
//         float glowGradient = smoothstep(GLOW_RADIUS, GLOW_RADIUS + 0.02, GLOW_RADIUS - distanceToSun);

//         // Calculate shining effect
//         float shineFactor = abs(sin(time * SHINE_SPEED) * 0.5 + 0.5); // Simulate light reflections
//         float shiningIntensity = smoothstep(SUN_RADIUS - 0.02, SUN_RADIUS, distanceToSun) * shineFactor * SHINE_INTENSITY;

//         // Combine gradients for sun, glow, and shining effect
//         vec3 sunColor = vec3(1.0, 0.85, 0.0); // Base color for the sun
//         vec3 glowColor = vec3(1.0, 0.85, 0.0) * 0.5; // Adjust glow color
//         vec3 finalColor = mix(sunColor, glowColor, glowGradient) + shiningIntensity;

//         // Render the sun with gradient, glow, and shining effect
//         if (distanceToSun < SUN_RADIUS) {
//             gl_FragColor = vec4(finalColor * sunGradient, 1.0);
//         } else {
//             gl_FragColor = vec4(0.0); // Transparent for pixels outside sun area
//         }

//         // Check if the sun is overlapping with the mountains
//         bool overlappingMountains = (uv.y < 0.2 * uv.x + 0.3 && uv.y < 0.2 * (1.0 - uv.x) + 0.3) ||
//                                      (uv.y < 0.2 * (uv.x - 0.5) + 0.3 && uv.y < 0.2 * (0.5 - uv.x) + 0.3) ||
//                                      (uv.y < 0.2 * (uv.x + 0.5) + 0.3 && uv.y < 0.2 * (-0.5 - uv.x) + 0.3);

//         // If the sun is not overlapping with the mountains, color it yellow
//         if (!overlappingMountains) {
//             // Render the sun instantly when it's not overlapping
//             if (distance(vec2(sunPositionX, sunPositionY), uv) < 0.05) {
//                 gl_FragColor = vec4(1.0, 0.85, 0.0, 1.0); 
//                 return;
//             }
//         }

//         // Color the mountains
//         if (overlappingMountains) {
//             gl_FragColor = vec4(calculateMountainColor(uv), 1.0); // Color the mountains
//             return;
//         }

//         // Adjust color based on the sun's position
//         float sunsetColorFactor = clamp(1.0 - sunPositionX * 4.0, 0.0, 4.0);
//         vec3 skyColor;

//         if (sunsetColorFactor < 1.0) {
//             // Daytime colors
//             skyColor = mix(vec3(0.529, 0.808, 0.922), vec3(0.8, 0.63, 0.5), sunsetColorFactor);
//         } else {
//             // Evening colors
//             float eveningFactor = (sunsetColorFactor - 1.0) * 2.0; // Scale factor for evening colors
//             vec3 eveningSkyColor = mix(vec3(0.8, 0.63, 0.5), vec3(0.545, 0.30, 0.074), eveningFactor); // Blend between orange and dark orange
//             skyColor = mix(vec3(0.8, 0.63, 0.5), eveningSkyColor, glowGradient); // Transition from daytime to evening
//         }

//         gl_FragColor = vec4(skyColor, 1.0);


//         // Calculate bird's position and draw the birds
//         float birdSpacingX = 0.5; // Adjust spacing between birds
//         float birdSpeed = 1.8; // Adjust speed of bird movement

//         for (int i = 0; i < 8; i++) {
//             float wingFrequency = 10.0; // Adjust the frequency of wing oscillation
//             float wingAmplitude = 0.1; // Adjust the amplitude of wing oscillation
//             float wingOffset = sin(time * wingFrequency) * wingAmplitude;
//             float birdPosX = mod(time * birdSpeed + float(i) * birdSpacingX, 1.0);
//             float birdPosY = 0.6 + sin(time * 6.0 + float(i)) * 0.05 + wingOffset; 
//             birdPosX += float(i) * 0.3; 
//             birdPosX = mod(birdPosX, 1.0); 
//             float birdDistanceX = abs(uv.x - birdPosX); 
//             float birdDistanceY = abs(uv.y - birdPosY); 
//             float birdDistance = sqrt(birdDistanceX * birdDistanceX + birdDistanceY * birdDistanceY);

//             if (birdDistance < BIRD_SIZE) {

//                 if (uv.y> birdPosY && uv.y< birdPosY + BIRD_SIZE) {
//                     // Body
//                     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for bird body
//                 } else if (uv.x > birdPosX && uv.x < birdPosX + BIRD_SIZE * 10.0 && uv.y > birdPosY - BIRD_SIZE * 0.5 && uv.y < birdPosY + BIRD_SIZE * 1.5) {
//                     // Wings
//                     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for bird wings
//                 } else if (uv.x > birdPosX + BIRD_SIZE * 2.0 && uv.x < birdPosX + BIRD_SIZE * 2.5 && uv.y > birdPosY - BIRD_SIZE * 0.2 && uv.y < birdPosY + BIRD_SIZE * 1.2) {
//                     // Head
//                     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for bird head
//                 } 
//                 else {
//                     discard; // Discard pixels outside of bird shape
//                 }
//             }
//         }

// }
// `;


//     // Create WebGL context
//     const canvas = document.getElementById('webglCanvas');
//     // const { width: W, height: H } = canvas.getBoundingClientRect() //for blurimage line131-133
//     // canvas.width = W
//     // canvas.height = H
//     const gl = canvas.getContext('webgl', { antialias: true });

//     // Compile shaders
//     function createShader(gl, type, source) {
//         const shader = gl.createShader(type);
//         gl.shaderSource(shader, source);
//         gl.compileShader(shader);
//         const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
//         if (success) {
//             return shader;
//         }
//         console.error(gl.getShaderInfoLog(shader));
//         gl.deleteShader(shader);
//     }
//     const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//     const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

//     // Create shader program
//     const shaderProgram = gl.createProgram();
//     gl.attachShader(shaderProgram, vertexShader);
//     gl.attachShader(shaderProgram, fragmentShader);
//     gl.linkProgram(shaderProgram);
//     gl.useProgram(shaderProgram);

//     // Create buffer for positions
//     const positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     const positions = [-1, -1,
//         1, -1, -1, 1, -1, 1,
//         1, -1,
//         1, 1,

//         -1, -1, -0.5, -2.0,
//         0, -1,

//         -0.5, -1,
//         0, -2.0,
//         0.5, -1,

//         0, -1,
//         0.5, -2.0,
//         1, -1,

//         -1, -1, -0.5, -1,
//     ];
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//     // Set position attribute
//     const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
//     gl.enableVertexAttribArray(positionAttributeLocation);
//     gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


//     const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'resolution');
//     gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);


//     let startTime = Date.now();

//     function updateTime() {
//         let currentTime = Date.now();
//         let elapsedTime = (currentTime - startTime) / 9000; // Convert to seconds
//         gl.uniform1f(gl.getUniformLocation(shaderProgram, 'time'), elapsedTime);
//     }


//     // Animation function
//     function animate() {
//         updateTime();

//         // Clear canvas
//         gl.clear(gl.COLOR_BUFFER_BIT);

//         // Draw the rectangle, sun, and birds
//         gl.drawArrays(gl.TRIANGLES, 0, 9);

//         // Continue animation
//         requestAnimationFrame(animate);
//     }


//     function renderCanvas() {
//         updateTime();
//         gl.clear(gl.COLOR_BUFFER_BIT);
//         gl.drawArrays(gl.TRIANGLES, 0, 9);
//     }

//     // Function to save canvas content as an image
//     function saveCanvasAsImage() {
//         renderCanvas();
//         const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//         const link = document.createElement('a');
//         link.download = 'dawn_to_dusk.png';
//         link.href = image;
//         link.click();
//     }

//     const downloadButton = document.getElementById('download-btn');
//     downloadButton.textContent = 'Download';
//     downloadButton.addEventListener('click', saveCanvasAsImage);
//     downloadButton.style.backgroundImage = 'url("downloads.png")';
//     downloadButton.style.backgroundRepeat = 'no-repeat';
//     downloadButton.style.backgroundPosition = 'left center';
//     downloadButton.style.backgroundSize = 'contain';
//     downloadButton.style.backgroundSize = '20px 20px';
//     downloadButton.style.paddingRight = '20px';
//     downloadButton.style.paddingLeft = '30px';
//     document.body.appendChild(downloadButton);


//     // Start animation
//     animate();
// });
class DawnToDuskRenderer extends Domel {
    constructor(canvasId) {
        super(canvasId);
        this.canvas = document.getElementById(canvasId);
        this.gl = this.canvas.getContext('webgl', { antialias: true });
        this.startTime = Date.now();
        this.init();

    }

    init() {
        const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec2 resolution;
            uniform float time;

            const float BIRD_SIZE = 0.01; // Size of the bird
            const float SUN_RADIUS = 1.0; // Adjust size of the sun
            const float GLOW_RADIUS = 100.0; // Adjust size of the glow effect
            const float SHINE_INTENSITY = 100.0;
            const float SHINE_SPEED = 100.0;
            
            // Function to calculate the color of the mountains
            vec3 calculateMountainColor(vec2 uv) {
                float mountainY = 0.2 * uv.x + 0.3;
                float mountain1 = min(uv.y, 0.2 * (1.0 - uv.x) + 0.9);
                float mountain2 = min(uv.y, 0.2 * (uv.x - 0.5) + 0.9);
                float mountain3 = min(uv.y, 0.2 * (uv.x + 0.5) + 0.3);
                float mountain4 = min(uv.y, 0.2 * (-0.5 - uv.x) + 0.3);
                
                float minHeight = min(min(mountain1, mountain2), min(mountain3, mountain4));
                float maxHeight = mountainY + 0.05; // Adjust the height to cover the mountains
            
                // Interpolate between light and dark green based on the y-coordinate of the pixel
                float gradient = smoothstep(minHeight, maxHeight, uv.y);
                return mix(vec3(0.0, 0.5, 0.0), vec3(0.8, 1.0, 0.2), gradient);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                
            
                // Calculate sun's position using a sine function for a curved path
                float t = mod(time, 1.03); // Ensure time repeats every 1 second
                float sunPositionX = mix(1.0, 0.0, t); // Move from 1.0 (right) to 0.0 (left)
                float sunPositionY = sin(t * 3.14) * 0.6 + 0.1;
        
            
                // Calculate distance to the sun
                float distanceToSun = distance(uv, vec2(sunPositionX, sunPositionY));
            
                // Create gradient for the sun
                float sunGradient = smoothstep(SUN_RADIUS, SUN_RADIUS + 0.02, SUN_RADIUS - distanceToSun);
            
                // Add glow effect around the sun
                float glowGradient = smoothstep(GLOW_RADIUS, GLOW_RADIUS + 0.02, GLOW_RADIUS - distanceToSun);
            
                // Calculate shining effect
                float shineFactor = abs(sin(time * SHINE_SPEED) * 0.5 + 0.5); // Simulate light reflections
                float shiningIntensity = smoothstep(SUN_RADIUS - 0.02, SUN_RADIUS, distanceToSun) * shineFactor * SHINE_INTENSITY;
            
                // Combine gradients for sun, glow, and shining effect
                vec3 sunColor = vec3(1.0, 0.85, 0.0); // Base color for the sun
                vec3 glowColor = vec3(1.0, 0.85, 0.0) * 0.5; // Adjust glow color
                vec3 finalColor = mix(sunColor, glowColor, glowGradient) + shiningIntensity;
            
                // Render the sun with gradient, glow, and shining effect
                if (distanceToSun < SUN_RADIUS) {
                    gl_FragColor = vec4(finalColor * sunGradient, 1.0);
                } else {
                    gl_FragColor = vec4(0.0); // Transparent for pixels outside sun area
                }
            
                // Check if the sun is overlapping with the mountains
                bool overlappingMountains = (uv.y < 0.2 * uv.x + 0.3 && uv.y < 0.2 * (1.0 - uv.x) + 0.3) ||
                                             (uv.y < 0.2 * (uv.x - 0.5) + 0.3 && uv.y < 0.2 * (0.5 - uv.x) + 0.3) ||
                                             (uv.y < 0.2 * (uv.x + 0.5) + 0.3 && uv.y < 0.2 * (-0.5 - uv.x) + 0.3);
            
                // If the sun is not overlapping with the mountains, color it yellow
                if (!overlappingMountains) {
                    // Render the sun instantly when it's not overlapping
                    if (distance(vec2(sunPositionX, sunPositionY), uv) < 0.05) {
                        gl_FragColor = vec4(1.0, 0.85, 0.0, 1.0); 
                        return;
                    }
                }
            
                // Color the mountains
                if (overlappingMountains) {
                    gl_FragColor = vec4(calculateMountainColor(uv), 1.0); // Color the mountains
                    return;
                }
            
                // Adjust color based on the sun's position
                float sunsetColorFactor = clamp(1.0 - sunPositionX * 4.0, 0.0, 4.0);
                vec3 skyColor;
            
                if (sunsetColorFactor < 1.0) {
                    // Daytime colors
                    skyColor = mix(vec3(0.529, 0.808, 0.922), vec3(0.8, 0.63, 0.5), sunsetColorFactor);
                } else {
                    // Evening colors
                    float eveningFactor = (sunsetColorFactor - 1.0) * 2.0; // Scale factor for evening colors
                    vec3 eveningSkyColor = mix(vec3(0.8, 0.63, 0.5), vec3(0.545, 0.30, 0.074), eveningFactor); // Blend between orange and dark orange
                    skyColor = mix(vec3(0.8, 0.63, 0.5), eveningSkyColor, glowGradient); // Transition from daytime to evening
                }
            
                gl_FragColor = vec4(skyColor, 1.0);
        
         
                // Calculate bird's position and draw the birds
                float birdSpacingX = 0.5; // Adjust spacing between birds
                float birdSpeed = 1.8; // Adjust speed of bird movement
                
                for (int i = 0; i < 8; i++) {
                    float wingFrequency = 10.0; // Adjust the frequency of wing oscillation
                    float wingAmplitude = 0.1; // Adjust the amplitude of wing oscillation
                    float wingOffset = sin(time * wingFrequency) * wingAmplitude;
                    float birdPosX = mod(time * birdSpeed + float(i) * birdSpacingX, 1.0);
                    float birdPosY = 0.6 + sin(time * 6.0 + float(i)) * 0.05 + wingOffset; 
                    birdPosX += float(i) * 0.3; 
                    birdPosX = mod(birdPosX, 1.0); 
                    float birdDistanceX = abs(uv.x - birdPosX); 
                    float birdDistanceY = abs(uv.y - birdPosY); 
                    float birdDistance = sqrt(birdDistanceX * birdDistanceX + birdDistanceY * birdDistanceY);
                
                    if (birdDistance < BIRD_SIZE) {
                
                        if (uv.y> birdPosY && uv.y< birdPosY + BIRD_SIZE) {
                            // Body
                            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for bird body
                        } else if (uv.x > birdPosX && uv.x < birdPosX + BIRD_SIZE * 10.0 && uv.y > birdPosY - BIRD_SIZE * 0.5 && uv.y < birdPosY + BIRD_SIZE * 1.5) {
                            // Wings
                            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for bird wings
                        } else if (uv.x > birdPosX + BIRD_SIZE * 2.0 && uv.x < birdPosX + BIRD_SIZE * 2.5 && uv.y > birdPosY - BIRD_SIZE * 0.2 && uv.y < birdPosY + BIRD_SIZE * 1.2) {
                            // Head
                            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for bird head
                        } 
                        else {
                            discard; // Discard pixels outside of bird shape
                        }
                    }
                }
                
        }
        `;

        // Compile shaders, create shader program, create buffers, etc.
        const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.shaderProgram);
        this.gl.useProgram(this.shaderProgram);

        // Create buffer for positions
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        const positions = [-1, -1,
            1, -1, -1, 1, -1, 1,
            1, -1,
            1, 1,

            -1, -1, -0.5, -2.0,
            0, -1,

            -0.5, -1,
            0, -2.0,
            0.5, -1,

            0, -1,
            0.5, -2.0,
            1, -1,

            -1, -1, -0.5, -1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        // Set position attribute
        const positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Set resolution uniform
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.shaderProgram, 'resolution');
        this.gl.uniform2f(this.resolutionUniformLocation, this.canvas.width, this.canvas.height);

        // Start the animation loop
        this.animate();
    }
    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    updateTime() {
        let currentTime = Date.now();
        let elapsedTime = (currentTime - this.startTime) / 9000; // Convert to seconds
        this.gl.uniform1f(this.gl.getUniformLocation(this.shaderProgram, 'time'), elapsedTime);
    }

    animate() {
        this.updateTime();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 9);
        requestAnimationFrame(this.animate.bind(this));
    }
    saveCanvasAsImage() {
        this.renderCanvas();
        const image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'dawn_to_dusk.png';
        link.href = image;
        link.click();
    }

    renderCanvas() {
        this.updateTime();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 9);
    }

}
document.addEventListener("DOMContentLoaded", function() {
    const dawnToDuskRenderer = new DawnToDuskRenderer('webglCanvas');
    const downloadButton = document.getElementById('download-btn');
    downloadButton.textContent = 'Download';
    downloadButton.addEventListener('click', dawnToDuskRenderer.saveCanvasAsImage.bind(dawnToDuskRenderer));
    downloadButton.style.backgroundImage = 'url("downloads.png")';
    downloadButton.style.backgroundRepeat = 'no-repeat';
    downloadButton.style.backgroundPosition = 'left center';
    downloadButton.style.backgroundSize = 'contain';
    downloadButton.style.backgroundSize = '20px 20px';
    downloadButton.style.paddingRight = '20px';
    downloadButton.style.paddingLeft = '30px';
    document.body.appendChild(downloadButton);
});



const start = new DawnToDuskRenderer('webglCanvas');
start.animate();