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
      resolve(true);
    })
  }
  stop() {
    return new Promise((resolve, reject) => {
      if (!this.alive()) reject({ "error": "Instance is offline" });
      this.process!.stdin.write("stop" + "\n");
      this.process!.on("exit", () => {
        this.process = null;
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
  getLog(limit = 50) {
    return this.log.slice(-limit);
  }
}