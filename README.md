V.Visualizer by Victoria Oliphant, 2024

// CODE CREATED BY VICTORIA OLIPHANT WITH HELP BY CLAUDE/CHAT GPT
// Github Link: https://torioliphant.github.io/V.Visualizer/
// ---- PARAMETERS -----
/*
   1. Sound Playback. Key: '1', '2', '3', '4' *NEW* '5', '6', '7'
   2. Pause/Play. Key: Mouse 
   3. Skip forward or back within track. Keys: RIGHT_ARROW, LEFT_ARROW
   3. Palette Selection. Key: 'w', 'a', 's', 'd'    *NEW* 'q'. 'e'
      Refresh to shuffle palette.
   4. Turn background off 'o', white "i", and black with 'u'
   3. Frame Rate. Keys: 'f' (15 FPS), 'g' (30 FPS), 'h' (60 FPS).
   4. Enable/Disable Line Mode. Keys: 'l' (enable), 'k' (disable).
   
   *NEW*
   5. 3D Controls -
        -Key: 'z'/'x' Rotate Y Axis On / Off
        -Key: 'c'/'v' Rotate X Axis On / Off
        -Key: 'b'/'n' (Move with Mouse Controls) PerspectiveMode On /Off    
   8. Hover over > SONGS or > CONTROLS to learn keycommands and view the songlist
   7. "Performance Mode" Toggle UI elements On / Off - Key: "t"
   
   
  ---- AUTOMATED PARAMETERS -----
/*
   1. Stroke Weight (Line Thickness): Controlled by trebleSmoothing or mapped variables in draw.
   2. Background Color Blending: Determined by lerpColor of current and next palette colors.
   3. Amplitude Level determines the size of circles and motion intensity.
   4. (FFT Analysis):
  Treble: Affects stroke transparency, weight, and layers within circle.
  Bass: Influences line speed and positions as well as amount of circles within the main circle shape.
  Mid, LowMid, HighMid: Modulate circle sizes and positions.

*NEW*
  5. Multiple Circles with various blendModes added for grainyness, texture, noise, and to create a gradient effect through layered reactive lerp functions.
  6. Varying mapping functions in TrebleSmoothing allows the number of layers within the circle to dynamically increase or decrease based on the amplitude of high frequencies.
   
  
*
