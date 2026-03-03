import cp from "child_process"

export class Proxy {
  name="proxy";
  process: cp.ChildProcessWithoutNullStreams | null = null;
  listeners: ((data: string) => void)[] = [];
  log: string[] = [];
  constructor() {
    this.addListener((data) => {
      this.log.push(data);
    });
    this.start();
  }
  start() {
    return new Promise((resolve, reject) => {
      if (this.alive()) reject({ "error": "Instance is online" });
      this.process = cp.spawn("java", ["-jar", "velocity.jar"], { cwd: `proxy` });
      this.process.stdout.on("data", (data) => {
        this.listeners.forEach((listener) => {
          listener(data.toString());
        });
      });
      this.process.on("exit", () => {
        this.process = null;
      });
      resolve(true);
    })
  }
  stop() {
    return new Promise((resolve, reject) => {
      if (!this.alive()) reject({ "error": "Instance is offline" });
      this.process!.stdin.write("stop" + "\n");
      this.process!.on("exit", () => {
        resolve(true);
      });
    })
  }
  alive() {
    return this.process !== null;
  }
  addListener(listener: (data: string) => void) {
    this.listeners.push(listener);
  }
  send(data: string) {
    if (!this.alive()) return;
    this.process!.stdin.write(data + "\n");
  }
  getLog(limit = 50) {
    return this.log.slice(-limit);
  }
}