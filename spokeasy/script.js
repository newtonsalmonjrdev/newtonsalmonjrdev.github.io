"use strict";

// const { map } = require("lodash-es");
// Clear Cache by Reloading with No Cache

let audioContext;
let amplitude,
  mic,
  micIsActive = false;
let pitch;
let pitchVar = 0;
let pitchArrayTrue = []; // Store recent pitch values
let maxArraySize = 5;
let lowerlimitVar = "Lower";
let upperLimitVar = "Upper";
let targetLimitVar = "Target";

function setup() {
  let cnv = createCanvas(300, 300);
  frameRate(5);
  cnv.parent("sketch-holder");
  cnv.position(0, 0);
  textAlign(CENTER, CENTER);
  audioContext = getAudioContext();
  startMic();

  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function startMic() {
  if (!micIsActive) {
    mic = new p5.AudioIn();
    mic.start(startPitch);
    micIsActive = true;
    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);
    console.log("Mic started.");
  }
}

function stopMic() {
  if (micIsActive) {
    mic.stop();
    micIsActive = false;
    console.log("Mic stopped and memory cleared.");
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    noLoop();
    // Stop the mic when tab is hidden
    stopMic();
    // Stop the draw loop when the tab is inactive
    console.log("Tab is inactive. draw() loop stopped.");
  } else if (document.visibilityState === "visible") {
    loop();
    // Start the mic when tab is visible
    startMic();
    // Resume the draw loop when the tab is active
    console.log("Tab is active. draw() loop resumed.");
  }
}
function centerCanvas() {
  const formControlWidth = getComputedStyle(
    document.querySelector(".form-control")
  ).width;
  const formControlNumber = parseInt(formControlWidth, 10);
  const canvasCenter = formControlNumber / 2 - 150;

  document.getElementById("sketch-holder").style.left = `${canvasCenter}px`;
}

centerCanvas();
function startPitch() {
  // https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models@main/models/pitch-detection/crepe/
  //   let model_url =
  //     "https://github.com/ml5js/ml5-data-and-models/tree/main/models/pitch-detection/crepe/";
  let model_url =
    "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  select("#status").html("Status: Model Loaded");

  getPitch();
}

function getMedian(pitchArrayTrue) {
  const sorted = [...pitchArrayTrue].sort((a, b) => a - b); // Sort the array
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid] // Odd length: middle value
    : (sorted[mid - 1] + sorted[mid]) / 2; // Even length: average of two middle values
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (err) {
      console.error("Pitch detection error:", err);
      select("#result").html("Error detecting pitch");
      return; // Exit to avoid further issues
    }

    if (frequency) {
      //   console.log("Detected frequency:", frequency);
      //   pitchArray = [frequency, ...pitchArray.slice(0, 5)];

      //Pitch Median True
      pitchArrayTrue = [frequency, ...pitchArrayTrue.slice(0, 5)]; // Keep last 5 pitches      let avgPitchTrue =
      const medianPitch = getMedian(pitchArrayTrue);
      //   console.log("Median Pitch:", medianPitch.toFixed(2));
      //   console.log(medianPitch);
      select("#result").html(`Detected Pitch: ${medianPitch.toFixed(2)} Hz`);
      pitchVar = medianPitch; // Update pitchVar with detected frequency
    } else {
      select("#result").html("No pitch detected");
      pitchVar = 0; // Reset pitchVar if no pitch is detected
    }

    // Throttle pitch detection to prevent overloading
    setTimeout(getPitch, 50);
  });
}

// function getPitch() {
//   // Request a pitch from the model
//   pitch.getPitch(function (err, frequency) {
//     if (err) {
//       console.error("Error in pitch detection:", err);
//       select("#result").html("Error detecting pitch");
//       return; // Exit to avoid infinite recursion
//     }

//     if (frequency) {
//       // Update pitch array and display detected pitch
//       pitchArray = [frequency, ...pitchArray.slice(0, 5)];
//       select("#result").html(`Detected Pitch: ${pitchArray[2].toFixed(2)} Hz`);
//       pitchVar = pitchArray[2];
//     } else {
//       // Handle no pitch detected
//       select("#result").html("No pitch detected");
//       pitchVar = 0; // Reset pitchVar if no pitch is detected
//     }
//     console.log("Pitch object:", pitch);

//     // Call getPitch again for continuous detection
//     setTimeout(getPitch, 50); // Use setTimeout instead of recursion for better control
//   });
// }
// function getPitch() {
//   pitch.getPitch(function (err, frequency) {
//     if (frequency) {
//       pitchArray.push(frequency);
//       pitchArray = [frequency, ...pitchArray.slice(0, 5)];
//       select("#result").html(pitchArray[2]);
//     } else {
//       select("#result").html("No pitch detected");
//     }
//     pitchVar = pitchArray[2];

//     getPitch();
//   });
// }

let spokeSum = 0;
let getTargetPitchVar;
let spokeSumdoublecheck = false;
let globalTableEntryCheck = false;

function getTargetPitch() {
  getTargetPitchVar = document.getElementById("targetPitch").value;
  return getTargetPitchVar;
}
// tpitchbut.addEventListener("click", (event) => {
//   getTargetPitch();
// });

// formpush.addEventListener("click", (event) => {
//   formtable();
// });

// function formtable() {
//   let tabletype = document.getElementById("spokenum");
//   let spokeNumVal = tabletype.value;
//   let tableElement = document.getElementById(`table${spokeNumVal}`);
//   document.getElementById("entryval").max = Number(spokeNumVal);
//   if (tableElement.style.display === "none") {
//     document.getElementById("table24").style.display = "none";
//     document.getElementById("table28").style.display = "none";
//     document.getElementById("table32").style.display = "none";
//     document.getElementById("table36").style.display = "none";
//     document.getElementById("table48").style.display = "none";
//     document.getElementById("spoketabletitle").style.display = "none";
//     document.getElementById("spoketabletitle").style.display = "block";

//     tableElement.style.display = "block";
//   } else {
//     document.getElementById("table24").style.display = "none";
//     document.getElementById("table28").style.display = "none";
//     document.getElementById("table32").style.display = "none";
//     document.getElementById("table36").style.display = "none";
//     document.getElementById("table48").style.display = "none";
//     document.getElementById("spoketabletitle").style.display = "none";
//     document.getElementById("spoketabletitle").style.display = "block";
//     tableElement.style.display = "block";
//   }
// }

// spokepitchbut.addEventListener("click", (event) => {
//   spokePitchtoTable();
// });

generatetableid.addEventListener("click", (event) => {
  generateTable();
});

cleartableid.addEventListener("click", (event) => {
  clearTable();
});

function generateTable() {
  // Get the selected number of spokes
  const spokeNumVal = parseInt(document.getElementById("spokenum").value, 10);

  // Validate the selected number
  if (![24, 28, 32, 36, 48].includes(spokeNumVal)) {
    alert("Invalid number of spokes selected.");
    return;
  }

  // Calculate approximate number of columns
  const columns = Math.ceil(Math.sqrt(spokeNumVal));
  const rows = Math.ceil(spokeNumVal / columns);

  // Get the table body and clear previous rows
  const tableBody = document
    .getElementById("spoketable")
    .querySelector("tbody");
  tableBody.innerHTML = ""; // Clear previous rows

  let currentSpoke = 1;

  // Generate table rows and columns
  for (let row = 0; row < rows; row++) {
    const tableRow = document.createElement("tr");

    for (let col = 0; col < columns; col++) {
      const spokeCell = document.createElement("td");

      if (currentSpoke <= spokeNumVal) {
        // Spoke label and small input field
        spokeCell.innerHTML = `Spoke ${currentSpoke}: 
            <input 
              type="number" 
              id="spoke${currentSpoke}" 
              class="pitch-input" 
              oninput="this.value = this.value.replace(/[^0-9]/g, '')" 
              min="0"
              style="width: 50px; padding: 2px; font-size: 12px;"
            />`;
        currentSpoke++;
      }

      tableRow.appendChild(spokeCell);
    }

    tableBody.appendChild(tableRow);
  }

  console.log(
    `Generated table with ${rows} rows and ${columns} columns for ${spokeNumVal} spokes.`
  );
}

function validateTableInputs() {
  const inputs = document.querySelectorAll(".pitch-input");
  let allFilled = true;

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      allFilled = false;
      input.style.border = "2px solid red"; // Highlight empty inputs
    } else {
      input.style.border = ""; // Reset border for filled inputs
    }
  });

  if (!allFilled) {
    alert("Please fill in all the input fields before proceeding.");
  } else {
    alert("All inputs are filled. You can proceed!");

    identifyExceedingSpokes();
    adjustHeightBasedOnAverage();
  }
}

function clearTable() {
  // Select all inputs within the table and clear their values
  const inputs = document.querySelectorAll(".pitch-input");
  inputs.forEach((input) => {
    input.value = ""; // Clear the input field
  });

  console.log("All table inputs have been cleared.");
}

function calculateAverage() {
  const inputs = document.querySelectorAll(".pitch-input");
  let sum = 0;
  let count = 0;

  inputs.forEach((input) => {
    const value = parseFloat(input.value.trim());
    if (!isNaN(value)) {
      sum += value;
      count++;
    }
  });

  // Avoid division by zero
  return count > 0 ? sum / count : 0;
}

//Upper, Lower and Target Pitch Limits
let lowerPitchEnter = document.getElementById("lowerLimitBut");
let lowerPitchInputVal = document.getElementById("lowerLimit");
let upperPitchEnter = document.getElementById("upperLimitBut");
let upperPitchInputVal = document.getElementById("upperLimit");
let targetPitchEnter = document.getElementById("targetPitchBut");
let targetPitchInputVal = document.getElementById("targetPitch");

lowerPitchEnter.addEventListener("click", (event) => {
  lowerlimitVar = lowerPitchInputVal.value;
});
upperPitchEnter.addEventListener("click", (event) => {
  upperLimitVar = upperPitchInputVal.value;
});
targetPitchEnter.addEventListener("click", (event) => {
  targetLimitVar = targetPitchInputVal.value;
});

function spokePitchtoTable() {
  let spokepitchvar = document.getElementById("spokepitchid").value;
  return spokepitchvar;
}

// spokeentrybut.addEventListener("click", (event) => {
//   getTargetPitch();
//   //   spokeEntrytoTable();
//   //   spokePitchTotal();
//   widthCalcCheck();
//   spokeExceed();
// });

// function spokeEntrytoTable() {
//   let tabletype = document.getElementById("spokenum");
//   let spokeNumVal = tabletype.value;
//   let entryspokeVal = document.getElementById("entryval").value;
//   let spokeChange = `table${spokeNumVal}` + "S" + entryspokeVal;
//   let spokeChangeHTMLsearch = document.getElementById(`${spokeChange}`).id;

//   if (spokeChange === spokeChangeHTMLsearch) {
//     document.getElementById(`${spokeChange}`).innerHTML = spokePitchtoTable();
//     document.getElementById(`${spokeChange}`).style.color = "blue";
//   }
// }

// function spokePitchTotal() {
//   let tabletype = document.getElementById("spokenum");
//   let spokeNumVal = tabletype.value;
//   let spokeValArr = [];
//   let spokeSum = 0;
//   let tableEntryCompleteTally = 0;

//   for (let h = 0; h < Number(spokeNumVal); h++) {
//     let spokeAddition = document.getElementById(`table24S${h + 1}`).innerHTML;
//     spokeValArr.push(spokeAddition);
//   }

//   function findSpoke() {
//     for (let k = 0; k < Number(spokeNumVal); k++) {
//       let spokeAddition = document.getElementById(`table24S${k + 1}`).innerHTML;
//       if (spokeAddition.length != 0) {
//         tableEntryCompleteTally++;
//       }
//     }
//   }
//   findSpoke();

// //Runs every time "add to table" is pressed
// tableEntryCompleteCheck(tableEntryCompleteTally);
// return spokeSum;

// function widthCalculator() {
//   const pitchHeight = document.getElementById("classborderid").offsetHeight;
//   // console.log(calculateAverage());

//   const genAddVal = 0.001;
//   const sensitivityMultiplierVal = 1;
//   const pitchAvDiff = targetLimitVar - calculateAverage();

//   // Combine the calculations for mainAdjuster and sensitivity adjustments
//   const mainAdjusterWithSensitivity =
//     genAddVal * (sensitivityMultiplierVal + 1 / pitchAvDiff);

//   // Final pitch adjustment
//   let pitchAdjust = pitchAvDiff * pitchHeight * mainAdjusterWithSensitivity;
//   return pitchAdjust;
// }

// function widthCalcCheck() {
//   const pitchHeight = document.getElementById("classborderid").offsetHeight;

//   const widthBounds = 50;
//   if (globalTableEntryCheck) {
//     if (
//       widthCalculator() >= pitchHeight + widthBounds ||
//       widthCalculator() < pitchHeight - widthBounds
//     ) {
//       let pitchWidth = pitchHeight + 50;
//       document.getElementById("classborderid").style.width = pitchWidth;
//       return pitchWidth;
//     } else if (isNaN(widthCalculator())) {
//     } else {
//       let pitchWidth = widthCalculator();
//       // document.getElementById("classborderid").style.width = pitchWidth;
//       console.log(pitchHeight);
//       document.getElementById("classborderid").style.width = 50;
//       return "width=height";
//     }
//   }
// }

function identifyExceedingSpokes() {
  const inputs = document.querySelectorAll(".pitch-input");
  const average = calculateAverage();
  const exceedingSpokes = [];

  console.log(`Calculated Average: ${average.toFixed(2)}`); // Debugging

  inputs.forEach((input, index) => {
    const value = parseFloat(input.value.trim()); // Parse the input value
    console.log(`Spoke ${index + 1} Value: ${value}`); // Debugging

    if (!isNaN(value) && value > average + 20) {
      exceedingSpokes.push(`Spoke ${index + 1}`);
      input.style.border = "2px solid red"; // Highlight the exceeding spoke
    } else {
      input.style.border = ""; // Reset the border if within the threshold
    }
  });

  if (exceedingSpokes.length === 0) {
    alert("No spokes exceed the average by 20.");
  } else {
    alert(
      `The following spokes exceed the average by 20: ${exceedingSpokes.join(
        ", "
      )}`
    );
  }

  console.log(
    `Exceeding spokes: ${exceedingSpokes.length > 0 ? exceedingSpokes : "None"}`
  );
}

function adjustHeightBasedOnAverage() {
  const average = calculateAverage();
  const adjustmentLevels = [5, 10, 15, 20]; // Thresholds
  const heights = [330, 335, 340, 345, 350]; // Corresponding heights

  // Select all inputs and find if any exceeds the average
  const inputs = document.querySelectorAll(".pitch-input");
  let maxExceedance = 0;

  inputs.forEach((input) => {
    const value = parseFloat(input.value.trim()); // Parse input value
    if (!isNaN(value) && value > average) {
      const exceedance = value - average;
      maxExceedance = Math.max(maxExceedance, exceedance);
    }
  });

  // Determine the new height based on maxExceedance
  let newHeight = 330; // Default height if no exceedance
  for (let i = 0; i < adjustmentLevels.length; i++) {
    if (maxExceedance > adjustmentLevels[i]) {
      newHeight = heights[i + 1];
    }
  }

  // Update the element's height
  const classBorderElement = document.getElementById("classborderid");
  if (classBorderElement) {
    classBorderElement.style.height = `${newHeight}px`;
    console.log(`Updated height to: ${newHeight}px`);
  } else {
    console.error("Element with ID 'classborderid' not found.");
  }
}

//Evauates which specific spokes exceed the average
// function spokeExceed() {
//   const tabletype = document.getElementById("spokenum");
//   const spokeNumVal = tabletype.value;
//   const percentAv = 0.01;
//   let percentAvUpperCheck = getTargetPitchVar + getTargetPitchVar * percentAv;
//   let percentAvLowerCheck = getTargetPitchVar - getTargetPitchVar * percentAv;

//   if (globalTableEntryCheck) {
//     for (let h = 0; h < Number(spokeNumVal); h++) {
//       if (
//         document.getElementById(`table24S${h + 1}`).innerHTML >
//           percentAvUpperCheck ||
//         document.getElementById(`table24S${h + 1}`).innerHTML <
//           percentAvLowerCheck
//       ) {
//         document.getElementById(`table24S${h + 1}`).style.color = "red";
//         document.getElementById(`table24S${h + 1}`).style.textDecoration =
//           "underline";
//         document.getElementById("classborderid").style.top = "19.25%";
//         document.querySelector(".largeradial").style.top = "22.25%";
//       } else {
//         document.getElementById(`table24S${h + 1}`).style.color = "blue";
//         document.getElementById(`table24S${h + 1}`).style.textDecoration =
//           "none";
//       }
//     }
//   }
// }

function draw() {
  //Setting targetPitch boundaries for map function in h. May want to adjust the canvas size to encompass the entire range of values set below
  console.log("testing");
  background(200);
  if (micIsActive) {
    let level = amplitude.getLevel();
    let micSensitivity = document.getElementById("setvolume").value;

    // Background Fill Color

    // Target Pitch Rectangle
    fill("green");
    rect(width / 2 - 8, height / 2, 10, 200);

    // Draw an rectangle with placement based on pitch
    fill(127);
    stroke(500);

    // Small Wheel Conditions
    // let setVolume = document.getElementById("setvolume").valueAsNumber;
    // let smallWheelEle = document.getElementById("smallradialid");

    // function volumeWheelCheck() {
    //   const setvolumeAdjust = 0.1;
    //   if (frameCount % 45 === 0 && vol < setVolume) {
    //     smallWheelEle.classList.add("radStart");
    //     smallWheelEle.classList.remove("radEnd");
    //   } else {
    //     smallWheelEle.classList.remove("radStart");
    //     smallWheelEle.classList.add("radEnd");
    //   }
    //   // } else if (frameCount % 45 === 0 && vol > setVolume) {
    //   //   smallWheelEle.classList.remove("radStart");
    //   //   smallWheelEle.classList.add("radEnd");
    //   //   console.log("This is the setVolume: " + `${setVolume}`);
    //   //   console.log("Still Working" + `${vol}`);
    //   // }
    // }
    // volumeWheelCheck();

    textSize(16);
    fill(0);
    text(lowerlimitVar, 35, 290);
    textSize(16);
    fill(0);
    text(targetLimitVar, 150, 130);
    textSize(16);
    fill(0);
    text(upperLimitVar, 260, 290);
    rectangle();

    if (level > micSensitivity) {
      let h = map(pitchVar, lowerlimitVar, upperLimitVar, 1, width - 8, true);

      fill("grey");
      rect(h, width / 2, 5, 250);
    }
  } else {
    console.log("wait");
  }
}

function rectangle() {
  stroke(25);
  fill(255, 155, 255, 10);
  rect(0, 0, 298, 298, 10);
}

function touchStarted() {
  getAudioContext().resume();
}
