export class Clock {
  private _time: number;
  private _interval: number;
  private _clockElement: HTMLTableRowElement;

  // Animation - usually does not get context
  private anim(clock: Clock) {
    clock.draw();
  }

  draw() {
    this._time = Date.now();
    const date = new Date(this._time);
    const offset = date.getTimezoneOffset() / 60;
    const text = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: false,
      minute: "numeric",
      second: "numeric",
    });
    // + "." + (this._time % 1000).toString().padStart(3, "0");
    // Intl.DateTimeFormat().resolvedOptions().timeZone; // eg. America/Denver
    this._clockElement.cells[1].innerText = text;
  }

  constructor(document: Document) {
    this._time = Date.now();
    const date = new Date(this._time);
    const offset = date.getTimezoneOffset() / 60;
    this._clockElement = document.getElementById(
      "gpsClock"
    ) as HTMLTableRowElement;
    this._clockElement.cells[0].innerText = `GPS Clock (UTC${
      (offset < 0 ? "" : "+") + offset
    })`;
    this.draw();
  }

  stop() {
    clearInterval(this._interval);
  }
}
