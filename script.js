const loops = [
  {
    id: "FGaO0krcOE4",
    range: [0, 25, 3, 38],
  },
  {
    id: "ney291VKSJM",
    range: [0, 12, 3, 10],
  },
];

const LOOP_BUTTON = "div.efyt-control-bar > button#efyt-loop";
const LOOP_PANEL = "#efyt-loop-panel";

const set = (name, value) => {
  const evt = new InputEvent("input");
  const elem = document.querySelector(`input[name="${name}"`);
  elem.value = value;
  elem.dispatchEvent(evt);
};

const getId = () => {
  const url = new URL(window.location);
  return url.searchParams.get("v");
};

window.addEventListener("yt-player-updated", () => {
  const video = document.querySelector("video.html5-main-video");
  if (!video) {
    console.warn("yt-player-updated: No video element found, skipping.");
    return;
  }
  if (video.currentTime > 0) {
    ytApplyLoop();
  } else {
    const onLoaded = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      ytApplyLoop();
    };
    video.addEventListener("loadedmetadata", onLoaded);
  }
});

const syntheticClick = elem => {
  elem.dispatchEvent(
    new CustomEvent("click", {
      detail: {
        synthetic: true,
      },
    })
  );
};

const onButtonClicked = e => {
  const panel = document.querySelector(LOOP_PANEL);
  if (!panel.hidden && !e.detail?.synthetic) {
    ytApplyLoop();
  }
};

function ytClearLoop() {
  const button = document.querySelector(LOOP_BUTTON);
  const panel = document.querySelector(LOOP_PANEL);
  syntheticClick(button);
  syntheticClick(button);
  if (button) {
    button.removeEventListener("click", onButtonClicked);
  }
  if (panel) {
    panel.hidden = true;
  }
}

function ytApplyLoop() {
  const panel = document.querySelector(LOOP_PANEL);
  const button = document.querySelector(LOOP_BUTTON);
  if (button) {
    button.addEventListener("click", onButtonClicked);
  }

  const id = getId();
  const loop = loops.find(loop => loop.id === id);
  if (!loop) {
    console.warn(`ytApplyLoop: No loop data found for current video id '${id}', skipping.`);
    ytClearLoop();
    return;
  }
  console.info(`ytApplyLoop: Applying loop data for current video id '${id}'.`);

  if (!panel || panel.hidden) {
    syntheticClick(button);
  }
  const [sm, ss, em, es] = loop.range;

  set("start-minutes", sm);
  set("start-seconds", ss);
  set("end-minutes", em);
  set("end-seconds", es);
}
