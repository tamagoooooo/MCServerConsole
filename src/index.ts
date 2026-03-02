import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";
import { Manager } from "./Manager";
import rl from "readline";

function main() {
  const app = new Hono();
  const manager = new Manager();

  app.get("/api/terminal", upgradeWebSocket((c) => {
    return {
      onOpen: () => {

      },
      onClose: () => {

      },
      onMessage: async (event, ws) => {
        const result = await terminalCommandExecuter(event.data.toString())
        ws.send(result || "")
      }
    }
  }))

  app.get("/api/list", (c) => {
    return c.json(manager.instanceManager.list());
  })

  app.get("/api/log", (c) => {
    return c.json(manager.instanceManager.getLog(c.req.query("name") || ""));
  })

  app.get("/api/servers/:name/start", async (c) => {
    try {
      const result = await manager.instanceManager.start(c.req.param("name"));
      return c.text(result ? "Success" : "Failed");
    } catch (e) {
      return c.text("Failed");
    }
  });

  app.get("/api/servers/:name/stop", async (c) => {
    try {
      const result = await manager.instanceManager.stop(c.req.param("name"));
      return c.text(result ? "Success" : "Failed");
    } catch (e) {
      return c.text("Failed");
    }
  });

  app.use("/api/servers/:name", upgradeWebSocket((c) => {
    return {
      onOpen: (event, ws) => {
        if (!manager.instanceManager.get(c.req.param("name"))) return ws.close();
        manager.instanceManager.get(c.req.param("name"))!.getLog().forEach((data) => {
          if (ws) ws.send(data)
        })
        manager.instanceManager.get(c.req.param("name"))!.addListener((data) => {
          if (ws) ws.send(data)
        })
      },
      onClose: () => {
      },
      onMessage: async (event, ws) => {
        manager.instanceManager.get(c.req.param("name"))?.send(event.data.toString())
      }
    }
  }))

  const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  readline.on("line", async (line) => {
    const result = await terminalCommandExecuter(line);
    console.log(result);
  });
  async function terminalCommandExecuter(command: string) {
    const args = command.split(" ");
    switch (args[0]) {
      case "exit":
        readline.close();
        await manager.instanceManager.stopAll();
        process.exit(0);
        return "true";
      case "start":
        if (!args[1]) return "Not enough args"
        return await manager.instanceManager.start(args[1]) ? "Success" : "Failed";
      case "stop":
        if (!args[1]) return "Not enough args"
        return await manager.instanceManager.stop(args[1]) ? "Success" : "Failed";
      case "list":
        return JSON.stringify(manager.instanceManager.list(), null, 2);
      case "log":
        if (!args[1]) return "Not enough args"
        return manager.instanceManager.getLog(args[1]).join("");
      default:
        return "Unknown command"
    }
  }


  Bun.serve({
    port: 8080,
    fetch: app.fetch,

    websocket
  })
}


main()