# Run your review site locally

Requires Node.js 24+ and npm. Clone your own review repository, enter its directory, and run:

```sh
npm install
npm run deploy:local
```

After a lockfile exists, use `npm ci` for repeatable installs. Open `http://localhost:3100`. This starts a development preview with automatic updates; it is not a production release or a public tunnel. Stop with Ctrl+C.

## Ports and Tailscale

```sh
npm run deploy:local -- --port 3200
npm run deploy:local -- --host 100.91.176.16 --port 3100
npm run deploy:local -- --check
```

Replace the example IP with your development computer’s actual Tailscale IP. The script binds to localhost by default, checks port availability, and refuses to stop an existing process. `--check` verifies dependencies and binding without starting Vite. If the port is occupied, choose another port. Tailscale must already be connected on both devices; access depends on your tailnet’s permissions and firewall.

In the site topbar, open **Check locally**, enter that address, select Tailscale, and save. These preferences are stored only in the current browser. The **Deploy locally** button provides a copyable command and this guide; browser security does not allow a Pages button to execute a command on your computer.

## Connect the MCP

```sh
npm --prefix mcp install
```

Configure your client using [the MCP guide](mcp.md), then use [after-change automation](automation.md). The server and target Orca checkout must be on the execution host. Node.js alone is sufficient for the site; recording Orca also requires the Orca development dependencies and a suitable isolated display on Linux.
