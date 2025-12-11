document.addEventListener("DOMContentLoaded", () => {
  const handle = document.getElementById("handle");
  const box = document.getElementById("box");
  const pipe = document.getElementsByClassName("pipe");

  const HANDLE_DOWN_MS = 120; // how long it stays down
  const HANDLE_RELEASE_MS = 220; // release animation time
  const BOX_ANIM_MS = 320; // box grow animation duration
  function pressPump() {
    if (handle.classList.contains("animating")) return;
    handle.classList.add("animating");
    handle.classList.add("handle-press");
    box.classList.remove("box-grow");
    void box.offsetWidth;
    box.classList.add("box-grow");
    setTimeout(() => {
      handle.classList.remove("handle-press");
      handle.classList.add("handle-release");
      setTimeout(() => {
        handle.classList.remove("handle-release");
        handle.classList.remove("animating");
      }, HANDLE_RELEASE_MS);
    }, HANDLE_DOWN_MS);
  }
  handle.addEventListener("click", (ev) => {
    ev.stopPropagation();
    pressPump();
  });

  handle.addEventListener(
    "touchstart",
    (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pressPump();
    },
    { passive: false }
  );
});
