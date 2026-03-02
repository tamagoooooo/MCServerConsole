import { InstanceManager } from "./instance";
import { Proxy } from "./ProxyManager";

export class Manager {
  instanceManager: InstanceManager;
  proxy: Proxy;
  constructor() {
    this.instanceManager = new InstanceManager();
    this.proxy = new Proxy();
  }
}