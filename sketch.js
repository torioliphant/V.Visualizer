// CODE CREATED BY VICTORIA OLIPHANT WITH HELP BY CLAUDE/CHAT GPT
// ---- PARAMETERS -----
/*
   1. Sound Playback. Key: '1', '2', '3', '4'
   2. Pause/Play. Key: Mouse 
   3. Skip forward or back within track. Keys: RIGHT_ARROW, LEFT_ARROW
   3. Palette Selection. Key: 'w', 'a', 's', 'd'
   Refresh to shuffle palette.
   4. Turn background off 'o', white "i", and black with 'u'
   3. Frame Rate. Keys: 'f' (15 FPS), 'g' (30 FPS), 'h' (60 FPS).
   4. Enable/Disable Line Mode. Keys: 'l' (enable), 'k' (disable).
   
   Automated Parameters
   
   1. Stroke Weight (Line Thickness): Controlled by trebleSmoothing or mapped variables in draw.
   2. Background Color Blending: Determined by lerpColor of current and next palette colors.
   3. Amplitude Level determines the size of circles and motion intensity.
   4. (FFT Analysis):
  Treble: Affects stroke transparency and detail.
  Bass: Influences line speed and positions as well as amount of circles within the main circle shape.
  Mid, LowMid, HighMid: Modulate circle sizes and positions.

*/

// ---- 🌎 GLOBAL VARIABLES ----
let myShader;
let img1, img2, img3, img4;
let imagesEnabled = true;
let sound, sound1, sound2, sound3, sound4, sound5, fft, amplitude;
let isPlaying = false;
let trebleSmoothing = 0;
let palette = [
  "#f6511d",
  "#ffb400",
  "#00a6ed",
  "#7fb800",
  "#0d2c54",
  "#ff9a00",
  "#f6f7d7",
  "#3ec1d3",
  "#dd3939",
  "#cc0000",
  "#bb0000",
  "#5bc0eb",
  "#fde74c",
  "#9bc53d",
  "#bb3fa9",
];
let linemode = false,
  lineSpacing = 50;
var lineX = 0,
  speed = 10;
let bgColor = 0,
  backgroundEnabled = true;
let threeD = false,
  threeZ = false,
  fourD = false;

// ----✔︎PRELOAD ----
function preload() {
  soundFormats("mp3");
  sound1 = loadSound("365-charli.mp3");
  sound2 = loadSound("Yes Yes (Hybrid Theory Remix) [ ezmp3.cc ].mp3");
  sound3 = loadSound("PARTY [ ezmp3.cc ].mp3");
  sound4 = loadSound(
    "Caroline Polachek - Welcome To My Island [Official Music Video] [ ezmp3.cc ].mp3"
  );
  sound5 = loadSound("Floating Points - Birth4000 (Official Audio).mp3");
  sound6 = loadSound("Sophie - Nothing More To Say (Dub).mp3");
  sound7 = loadSound(
    "The Crystal Method - Keep Hope Alive (There Is Hope Mix).mp3"
  );
  sound7.setVolume(1.75);
  sound = sound1;
  bloomShader = loadShader("bloom.vert", "bloom.frag");
  
  img1 = loadImage('genartui.001.png');
  img2 = loadImage('genartui.002.png');
  img3 = loadImage('genartui.003.png');
  img4 = loadImage('genartui.004.png');
}

// ---- ✔︎SETUP ----
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(bgColor);
  fft = new p5.FFT();
  fft.setInput(sound);
  amplitude = new p5.Amplitude();
  amplitude.setInput(sound);

  noStroke();
  frameRate(60);
  palette = shufflePalette(palette);
}

// ----🎨 DRAW ----
function draw() {
  if (backgroundEnabled) {
    background(bgColor);
  }

  // FFT ANALYZING
  let spectrum = fft.analyze();
  let midsEnergy = fft.getEnergy("mid");
  let lowMidsEnergy = fft.getEnergy("lowMid");
  let highMidsEnergy = fft.getEnergy("highMid");
  let bass = fft.getEnergy("bass");
  let level = amplitude.getLevel();
  let normalizedMids;
  if (level > 0.42) {
    normalizedMids = map(midsEnergy, 0, 2000, 0.5, midsEnergy * 4);
  } else {
    normalizedMids = map(midsEnergy, 0, 2000, 0.5, midsEnergy * 0.1);
  }
  let normalizedLowMids = map(lowMidsEnergy, 0, 255, -width / 4, width / 4);
  let normalizedHighMids = map(highMidsEnergy, 0, 255, -height / 4, height / 4);

  //---- 3D TRANSFORMS -------------------
  if (threeD === true) {
    rotateY(frameCount);
  }
  if (threeZ === true) {
    rotateZ(frameCount);
  }
  if (fourD === true) {
    let fov = PI / 3;
    let aspect = width / height;
    let near = 0.1;
    let far = 2000;
    perspective(fov, aspect, near, far);
    let rotationX = map(mouseY, 0, height, -PI, PI);
    let rotationY = map(mouseX, 0, width, -PI, PI);
    rotateX(rotationX);
    rotateY(rotationY);
  }

  //-----LINES-----
  if (linemode === true) {
    push();
    strokeCap(SQUARE);
    strokeWeight(1);
    stroke(random(palette));
    let bottomY = windowHeight / 2 - 100;
    let topY = -windowHeight / 2 + 100;
    //DRAW LINES
    line(lineX, bottomY, lineX + 25, bottomY);
    line(lineX, bottomY + lineSpacing, lineX + 25, bottomY + lineSpacing);
    line(lineX, bottomY + lineSpacing, lineX + 25, bottomY + lineSpacing);
    line(lineX, bottomY + 100, lineX + 25, bottomY + 100);
    line(lineX, topY, lineX + 25, topY);
    line(lineX, topY - lineSpacing, lineX + 25, topY - lineSpacing);
    line(lineX, topY - 100, lineX + 25, topY - 100);
    //LINES ADDED REACTIVE LENGTH
    line(lineX + (bass - 150), bottomY, lineX + 25, bottomY);
    line(
      lineX + (bass - 150),
      bottomY + lineSpacing,
      lineX + 25,
      bottomY + lineSpacing
    );
    line(
      lineX + (bass - 150),
      bottomY + lineSpacing,
      lineX + 25,
      bottomY + lineSpacing
    );
    line(lineX + (bass - 150), bottomY + 100, lineX + 25, bottomY + 100);
    line(lineX + (bass - 150), topY, lineX + 25, topY);
    line(
      lineX + (bass - 150),
      topY - lineSpacing,
      lineX + 25,
      topY - lineSpacing
    );
    line(lineX + (bass - 150), topY - 100, lineX + 25, topY - 100);
    lineX = lineX + speed;
    pop();
    if (lineX > width / 2) {
      speed = -speed;
    } else if (lineX + 100 < -width / 2) {
      speed = bass;
    }
  }

  //----CIRCLES-------------------------------------------------------

  // CIRCLE SIZE
  let circleRadius = normalizedMids * (width / 9);
  let centerX = 0;
  let centerY = 0;

  // COLOR/FFT BLENDING
  let trebleEnergy = fft.getEnergy("treble");
  let normalizedTreble = map(trebleEnergy, 0, 255, 0, 1);
  trebleSmoothing = lerp(trebleSmoothing, normalizedTreble, 0.4);
  // BACKROUND CIRCLE COLOR
  let colorIndex = floor(map(trebleSmoothing, 0, 1, 0, palette.length - 1));
  let nextColorIndex = (colorIndex + 1) % palette.length;
  let currentColor = color(palette[colorIndex]);
  let nextColor = color(palette[nextColorIndex]);
  let blendedColor = lerpColor(currentColor, nextColor, trebleSmoothing);

  // MAIN CIRCLE
  let colorIndex2 = (colorIndex + 2) % palette.length;
  let nextColorIndex2 = (colorIndex2 + 1) % palette.length;
  let currentColor2 = color(palette[colorIndex2]);
  let nextColor2 = color(palette[nextColorIndex2]);
  let blendedColor2 = lerpColor(currentColor2, nextColor2, trebleSmoothing);
  // blended color for MAIN CIRCLE LAYER 2
  let nextColor3 = color(palette[(colorIndex2 + 2) % palette.length]);
  let blendedColor3 = lerpColor(blendedColor2, nextColor3, trebleSmoothing);
  //blended color for MAIN CIRCLE LAYER 1
  let nextColor4 = color(palette[(colorIndex2 + 3) % palette.length]);
  let blendedColor4 = lerpColor(blendedColor2, nextColor4, trebleSmoothing);

  // GRAINY CIRCLE
  for (let i = 0; i < 1000; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * (circleRadius * 2);
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let opacity = map(trebleSmoothing, 0, 10, 20, 255);
    let colorWithAlpha = color(
      red(blendedColor),
      green(blendedColor),
      blue(blendedColor),
      opacity
    );
    stroke(colorWithAlpha);
    strokeWeight(map(trebleSmoothing / 7, 0, 1.5, 0.1, windowHeight / 2));
    point(x, y);
  }

  ////--UNDER LAYER CIRCLE 2
  for (let i = 0; i < bass * 1; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * (circleRadius * 1.5);
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let z = -250;
    push();
    translate(x, y, z);
    blendMode(EXCLUSION);
    stroke(blendedColor4);
    strokeWeight(map(trebleSmoothing, 0, 3, 0.1, windowHeight / 4));
    point(0, 0);
    pop();
  }

  ////--UNDER LAYER CIRCLE 1
  for (let i = 0; i < bass * 1; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * (circleRadius * 1.25);
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let z = -100;
    push();
    translate(x, y, z);
    blendMode(ADD);
    stroke(blendedColor4);
    strokeWeight(map(trebleSmoothing / 4, 0, 3, 0.1, windowHeight / 4));
    point(0, 0);
    pop();
  }

  //--MAIN CIRCLE - LAYER 3
  for (let i = 0; i < bass * 3; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * circleRadius;
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    stroke(blendedColor2);
    strokeWeight(map(trebleSmoothing, 0, 3, 0.1, windowHeight / 4));
    point(x, y);
  }

  // --MAIN CIRCLE - LAYER 2
  for (let i = 0; i < bass * 2; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * (circleRadius * 0.75);

    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let z = 100;

    push();
    translate(x, y, z);
    blendMode(DARKEST);
    stroke(blendedColor3);
    strokeWeight(map(trebleSmoothing * 0.85, 0, 3, 0.1, windowHeight / 4));
    point(0, 0);
    pop();
  }

  // --MAIN CIRCLE - LAYER 1
  for (let i = 0; i < bass * 1; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * (circleRadius * 0.4);
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let z = 300;
    push();
    translate(x, y, z);
    blendMode(LIGHTEST);
    stroke(blendedColor4);
    strokeWeight(map(trebleSmoothing * 0.65, 0, 3, 0.1, windowHeight / 4));
    point(0, 0);
    pop();
  }

  //--BRIGHT CIRCLE
  for (let i = 0; i < bass * 1; i++) {
    let angle = random(TWO_PI);
    let distance = sqrt(random()) * (circleRadius * 0.5);
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let z = 500;
    push();
    translate(x, y, z);
    blendMode(ADD);
    stroke(blendedColor2);
    strokeWeight(map(trebleSmoothing / 10, 0, 3, 0.1, windowHeight / 4));
    point(0, 0);
    pop();
  }
  
  
  // ---------UI ELEMENTS --------------------------------------------
   if (imagesEnabled) {
    let img3X = -windowWidth / 2; // Top-left corner for img3
    let img3Y = -windowHeight / 2;
    let img3Width = 85;
    let img3Height = 35;
    let img4X = img3X; 
    let img4Y = img3Y + img3Height - 10;
    let img4Width = 110;
    let img4Height = 33;
    image(img3, img3X, img3Y, img3Width, img3Height);
    image(img4, img4X, img4Y, img4Width, img4Height);
    let adjustedMouseX = mouseX - width / 2;
    let adjustedMouseY = mouseY - height / 2;
   //HOVER
     if (
      adjustedMouseX > img3X &&
      adjustedMouseX < img3X + img3Width &&
      adjustedMouseY > img3Y &&
      adjustedMouseY < img3Y + img3Height
    ) {
      image(img2, (-windowWidth + windowWidth),(-windowHeight + windowHeight/1.5), 700, 400); 
    }
     
    if (
      adjustedMouseX > img4X &&
      adjustedMouseX < img4X + img4Width &&
      adjustedMouseY > img4Y &&
      adjustedMouseY < img4Y + img4Height
    ) {
      image(img1, (-windowWidth + windowWidth/1.5 ),(-windowHeight + windowHeight/2), 800, 450); // Centered and resized img1 when hovering over img4
    }
  }
}


function mousePressed() {
  if (isPlaying) {
    sound.pause();
    isPlaying = false;
  } else {
    sound.play();
    isPlaying = true;
  }
}

///-----KEY CONTROLS-----------------------------
function keyPressed() {
  // song changes
  if (key === "1") {
    changeSound(sound1);
  } else if (key === "2") {
    changeSound(sound2);
  } else if (key === "3") {
    changeSound(sound3);
  } else if (key === "4") {
    changeSound(sound4);
  } else if (key === "5") {
    changeSound(sound5);
  } else if (key === "6") {
    changeSound(sound6);
  } else if (key === "7") {
    changeSound(sound7);
  }

  // frame rate changes
  if (key === "f") {
    frameRate(15);
  } else if (key === "g") {
    frameRate(30);
  } else if (key === "h") {
    frameRate(60);
  }

  // Enable line mode
  if (key === "l") {
    linemode = true;
  } else if (key === "k") {
    linemode = false;
  }
  /// 3D CONTROLS
  if (key === "z") {
    threeD = true;
  } else if (key === "x") {
    threeD = false;
  } else if (key === "b") {
    fourD = true;
  } else if (key === "n") {
    fourD = false;
  } else if (key === "c") {
    threeZ = true;
  } else if (key === "v") {
    threeZ = false;
  }
  //BACKGROUND
  if (key === "i") {
    backgroundEnabled = true;
    bgColor = 255;
  } else if (key === "u") {
    backgroundEnabled = true;
    bgColor = 0;
  } else if (key === "o") {
    backgroundEnabled = false;
  }
  // Change color palette
  if (key === "w") {
    palette = [
      "#FF3131",
      "#FF5E00",
      "#FF1493",
      "#FF44CC",
      "#EA00FF",
      "#FFFFFF",
      "#FF00FF",
      "#FF6347",
      "#bf1304",
      "#ff9e9d",
      "#ff3d7f",
      "#fe4365",
      "#fc9d9a",
      "#f7d6e0",
      "#f2b5d4",
    ];
  } else if (key === "a") {
    palette = [
      "#00FF00",
      "#aee239",
      "#8fbe00",
      "#0000FF",
      "#0f5cbf",
      "#072b59",
      "#0f6dbf",
      "#042940",
      "#72dbf2",
      "#204037",
      "#558c3b",
    ];
  } else if (key === "s") {
    palette = [
      "#FF00FF",
      "#8a00d4",
      "#d527b7",
      "#27104e",
      "#64379f",
      "#9854cb",
      "#ddacf5",
      "#b61aae",
      "#590d82",
      "#0c056d",
      "#7e6bc4",
      "#c79ecf",
      "#d6c8ff",
    ];
  } else if (key === "d") {
    palette = [
      "#f6511d",
      "#ffb400",
      "#00a6ed",
      "#7fb800",
      "#0d2c54",
      "#ff9a00",
      "#f6f7d7",
      "#3ec1d3",
      "#dd3939",
      "#cc0000",
      "#bb0000",
      "#5bc0eb",
      "#fde74c",
      "#9bc53d",
      "#bb3fa9",
    ];
  } else if (key === "q") {
    palette = ["#000000", "#FF0000"];
  } else if (key === "e") {
    palette = ["#FFFFFF"];
  }

  // sound seeking
  if (keyCode === RIGHT_ARROW) {
    let currentTime = sound.currentTime();
    sound.jump(currentTime + 7);
  } else if (keyCode === LEFT_ARROW) {
    let currentTime = sound.currentTime();
    sound.jump(max(0, currentTime - 7));
  }
  //UI
  if (key === 'T' || key === 't') {
    imagesEnabled = !imagesEnabled;
  }
}

function changeSound(newSound) {
  if (sound) sound.stop();
  sound = newSound;
  fft.setInput(sound);
  amplitude.setInput(sound);
  sound.play();
  isPlaying = true;
}

function shufflePalette(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
