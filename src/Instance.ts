import fs from "fs"
import z from "zod"
import cp from "child_process"
import path from "path"

export class InstanceManager {
  instances: Map<string, Instance> = new Map<string, Instance>();
  constructor() {
    this.load();
  }
  load() {
    const dir = fs.readdirSync(path.resolve(__dirname, "..", "instances"));
    dir.forEach((dir) => {
      if (this.instances.get(dir)) return;
      this.instances.set(dir, new Instance(dir));
    });
  }
  start(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.instances.get(name)) reject({ "error": "Instance not found" });
      this.instances.get(name)!.start().then(resolve).catch(reject);
    })
  }
  stop(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.instances.get(name)) reject({ "error": "Instance not found" });
      this.instances.get(name)!.stop().then(resolve).catch(reject);
    })
  }
  list() {
    const result: { [key: string]: boolean } = {};
    for (const instance of this.instances.values()) {
      result[instance.name] = instance.alive();
    }
    return result;
  }
  async stopAll() {
    for (const instance of this.instances.values()) {
      try {
        await instance.stop();
      } catch {
        continue;
      }
    }
    return true;
  }
  getLog(name: string, limit = 50) {
    if (!this.instances.get(name)) return [];
    return this.instances.get(name)!.getLog(limit);
  }
  get(name: string) {
    if (!this.instances.get(name)) return null;
    return this.instances.get(name);
  }
}

export const InstanceSettingSchema = z.object({
  port: z.number(),
  start: z.object({
    command: z.string(),
    args: z.array(z.string()),
  }),
  commands: z.object({
    stop: z.string()
  })
});

export class Instance {
  name: string;
  settings: z.infer<typeof InstanceSettingSchema>;
  process: cp.ChildProcessWithoutNullStreams | null = null;
  listeners: ((data: string) => void)[] = [];
  log: string[] = [];
  constructor(name: string) {
    this.name = name;
    this.settings = InstanceSettingSchema.parse(JSON.parse(fs.readFileSync(`instances/${name}/settings.json`, "utf-8")));
    this.addListener((data) => {
      this.log.push(data);
    });
  }
  start() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.alive()) reject({ "error": "Instance is online" });
      this.process = cp.spawn(this.settings.start.command, this.settings.start.args, { cwd: `instances/${this.name}/minecraft` });
      this.process.stdout.on("data", (data) => {
        this.sendListener(data.toString());
      });
      this.process.stderr.on("data", (data) => {
        this.sendListener(data.toString());
      });
      resolve(true);
    })
  }
  stop() {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.alive()) reject({ "error": "Instance is offline" });
      this.process!.stdin.write(this.settings.commands.stop + "\n");
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
  send(data: string) {
    if (!this.alive()) return;
    this.process!.stdin.write(data + "\n");
  }
  sendListener(data: string) {
    this.listeners.forEach((listener) => {
      listener(data);
    });
  }
}