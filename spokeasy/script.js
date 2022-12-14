"use strict";

// const { map } = require("lodash-es");

let audioContext;
let mic;
let pitch;
let pitchArray = [];
let pitchVar;

function setup() {
  let cnv = createCanvas(300, 300);
  cnv.parent("sketch-holder");
  cnv.position(0, 0);
  textAlign(CENTER, CENTER);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  mic.start();
}

function startPitch() {
  let model_url =
    "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models@main/models/pitch-detection/crepe/";
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  select("#status").html("Status: Model Loaded");
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      pitchArray.push(frequency);
      pitchArray = [frequency, ...pitchArray.slice(0, 5)];
      select("#result").html(pitchArray[2]);
    } else {
      select("#result").html("No pitch detected");
    }
    pitchVar = pitchArray[2];
    getPitch();
  });
}

let spokeSum = 0;
let getTargetPitchVar;
let spokeSumdoublecheck = false;
let globalTableEntryCheck = false;

function getTargetPitch() {
  getTargetPitchVar = document.getElementById("tpitch").value;
  return getTargetPitchVar;
}

tpitchbut.addEventListener("click", (event) => {
  getTargetPitch();
});

formpush.addEventListener("click", (event) => {
  formtable();
});

function formtable() {
  let tabletype = document.getElementById("spokenum");
  let spokeNumVal = tabletype.value;
  let tableElement = document.getElementById(`table${spokeNumVal}`);
  document.getElementById("entryval").max = Number(spokeNumVal);
  if (tableElement.style.display === "none") {
    document.getElementById("table24").style.display = "none";
    document.getElementById("table28").style.display = "none";
    document.getElementById("table32").style.display = "none";
    document.getElementById("table36").style.display = "none";
    document.getElementById("table48").style.display = "none";
    document.getElementById("spoketabletitle").style.display = "none";
    document.getElementById("spoketabletitle").style.display = "block";

    tableElement.style.display = "block";
  } else {
    document.getElementById("table24").style.display = "none";
    document.getElementById("table28").style.display = "none";
    document.getElementById("table32").style.display = "none";
    document.getElementById("table36").style.display = "none";
    document.getElementById("table48").style.display = "none";
    document.getElementById("spoketabletitle").style.display = "none";
    document.getElementById("spoketabletitle").style.display = "block";
    tableElement.style.display = "block";
  }
}

spokepitchbut.addEventListener("click", (event) => {
  spokePitchtoTable();
});

function spokePitchtoTable() {
  let spokepitchvar = document.getElementById("spokepitchid").value;
  return spokepitchvar;
}

spokeentrybut.addEventListener("click", (event) => {
  getTargetPitch();
  spokeEntrytoTable();
  spokePitchTotal();
  widthCalcCheck();
  spokeExceed();
});

function spokeEntrytoTable() {
  let tabletype = document.getElementById("spokenum");
  let spokeNumVal = tabletype.value;
  let entryspokeVal = document.getElementById("entryval").value;
  let spokeChange = `table${spokeNumVal}` + "S" + entryspokeVal;
  let spokeChangeHTMLsearch = document.getElementById(`${spokeChange}`).id;

  if (spokeChange === spokeChangeHTMLsearch) {
    document.getElementById(`${spokeChange}`).innerHTML = spokePitchtoTable();
    document.getElementById(`${spokeChange}`).style.color = "blue";
  }
}

function spokePitchTotal() {
  let tabletype = document.getElementById("spokenum");
  let spokeNumVal = tabletype.value;
  let spokeValArr = [];
  let spokeSum = 0;
  let tableEntryCompleteTally = 0;

  for (let h = 0; h < Number(spokeNumVal); h++) {
    let spokeAddition = document.getElementById(`table24S${h + 1}`).innerHTML;
    spokeValArr.push(spokeAddition);
  }

  function findSpoke() {
    for (let k = 0; k < Number(spokeNumVal); k++) {
      let spokeAddition = document.getElementById(`table24S${k + 1}`).innerHTML;
      if (spokeAddition.length != 0) {
        tableEntryCompleteTally++;
      }
    }
  }
  findSpoke();

  function tableEntryCompleteCheck(tally) {
    let tabletype = document.getElementById("spokenum");
    let spokeNumVal = tabletype.value;
    if (tableEntryCompleteTally != Number(spokeNumVal)) {
      console.log("Table incomplete");
      return false;
    } else {
      console.log("Table completed!");
      spokeSum = spokeValArr
        .map(function (elt) {
          return /^\d+$/.test(elt) ? parseInt(elt) : 0;
        })
        .reduce(function (a, b) {
          return a + b;
        });

      globalTableEntryCheck = true;

      return true;
    }
  }

  //Runs every time "add to table" is pressed
  tableEntryCompleteCheck(tableEntryCompleteTally);
  return spokeSum;
}

function spokePitchAverage() {
  let tabletype = document.getElementById("spokenum");
  let spokeNumVal = tabletype.value;
  let pitchAv = spokePitchTotal() / spokeNumVal;
  return pitchAv;
}
function widthCalculator() {
  let pitchHeight = document.getElementById("classborderid").offsetHeight;
  //mainAdjuster can only be controlled by me on the backend; for every 5hz difference, width px increases by 5

  let genAddVal = 0.001;
  let sensitivityMultiplierVal = 1;
  let pitchAvDiff = getTargetPitchVar - spokePitchAverage();

  let mainAdjuster = 1 / pitchAvDiff + genAddVal;
  let mainAdjusterWithSensitivity =
    genAddVal * sensitivityMultiplierVal + mainAdjuster;
  let pitchAdjust = pitchAvDiff * pitchHeight * mainAdjusterWithSensitivity;

  return pitchAdjust;
}

function widthCalcCheck() {
  const pitchHeight = document.getElementById("classborderid").offsetHeight;
  const widthBounds = 50;
  if (globalTableEntryCheck) {
    if (
      widthCalculator() >= pitchHeight + widthBounds ||
      widthCalculator() < pitchHeight - widthBounds
    ) {
      let pitchWidth = pitchHeight + 50;
      document.getElementById("classborderid").style.width = pitchWidth;
      return pitchWidth;
    } else if (isNaN(widthCalculator())) {
    } else {
      let pitchWidth = widthCalculator();
      document.getElementById("classborderid").style.width = pitchWidth;
      return "width=height";
    }
  }
}

//Evauates which specific spokes exceed the average
function spokeExceed() {
  const tabletype = document.getElementById("spokenum");
  const spokeNumVal = tabletype.value;
  const percentAv = 0.01;
  let percentAvUpperCheck = getTargetPitchVar + getTargetPitchVar * percentAv;
  let percentAvLowerCheck = getTargetPitchVar - getTargetPitchVar * percentAv;

  if (globalTableEntryCheck) {
    for (let h = 0; h < Number(spokeNumVal); h++) {
      if (
        document.getElementById(`table24S${h + 1}`).innerHTML >
          percentAvUpperCheck ||
        document.getElementById(`table24S${h + 1}`).innerHTML <
          percentAvLowerCheck
      ) {
        document.getElementById(`table24S${h + 1}`).style.color = "red";
        document.getElementById(`table24S${h + 1}`).style.textDecoration =
          "underline";
        document.getElementById("classborderid").style.top = "19.25%";
        document.querySelector(".largeradial").style.top = "22.25%";
      } else {
        document.getElementById(`table24S${h + 1}`).style.color = "blue";
        document.getElementById(`table24S${h + 1}`).style.textDecoration =
          "none";
      }
    }
  }
}

function draw() {
  //Setting targetPitch boundaries for map function in h. May want to adjust the canvas size to encompass the entire range of values set below

  // Background Fill Color
  let vol = mic.getLevel();

  background(200);

  // Target Pitch Rectangle
  fill("green");
  rect(width / 2, height / 2, 5, 200);

  // Draw an rectangle with placement based on pitch
  fill(127);
  stroke(500);
  let h = map(pitchVar, 0, getTargetPitchVar * 2, 1, width);
  // let h = map(pitchVar, 0, 500, width / 2 - getTargetPitchVar, width);
  rect(h, width / 2, 5, 250);

  // Small Wheel Conditions
  let setVolume = document.getElementById("setvolume").valueAsNumber;
  let smallWheelEle = document.getElementById("smallradialid");

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
  text("Too Low", 35, 290);
  textSize(16);
  fill(0);
  text("Too High", 260, 290);
  rectangle();
}

function rectangle() {
  stroke(25);
  fill(255, 155, 255, 10);
  rect(0, 0, 298, 298, 10);
}

function touchStarted() {
  getAudioContext().resume();
}
