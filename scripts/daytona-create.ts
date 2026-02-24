import { Daytona, Image } from "@daytonaio/sdk";
import path from "node:path";

async function main() {
  const name = process.env.DAYTONA_SANDBOX_NAME ?? "store-sandbox";
  const snapshotName = process.env.DAYTONA_SNAPSHOT_NAME ?? "store-rails-codex";
  const autoStopInterval = Number(process.env.DAYTONA_AUTO_STOP_INTERVAL ?? 0);
  const autoArchiveInterval = Number(process.env.DAYTONA_AUTO_ARCHIVE_INTERVAL ?? 10080);
  const autoDeleteInterval = Number(process.env.DAYTONA_AUTO_DELETE_INTERVAL ?? -1);

  const daytona = new Daytona();
  const dockerfilePath = path.resolve(process.cwd(), "Dockerfile.daytona");
  const image = Image.fromDockerfile(dockerfilePath);

  let sandbox;
  try {
    sandbox = await daytona.findOne({ idOrName: name });
    console.log(`Sandbox "${name}" already exists (${sandbox.id}).`);
    await sandbox.start();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isNotFound = message.toLowerCase().includes("no sandbox found") || message.toLowerCase().includes("not found");
    if (!isNotFound) {
      throw error;
    }

    let snapshotExists = false;
    try {
      await daytona.snapshot.get(snapshotName);
      snapshotExists = true;
      console.log(`Using existing snapshot: ${snapshotName}`);
    } catch (snapshotError) {
      const snapshotMessage = snapshotError instanceof Error ? snapshotError.message : String(snapshotError);
      const snapshotNotFound = snapshotMessage.toLowerCase().includes("not found");
      const snapshotForbidden = snapshotMessage.toLowerCase().includes("forbidden");
      if (snapshotForbidden) {
        console.log("Snapshot access is forbidden in this Daytona target. Falling back to direct sandbox build.");
        sandbox = await daytona.create(
          {
            name,
            image,
            public: true,
            autoStopInterval,
            autoArchiveInterval,
            autoDeleteInterval,
          },
          {
            timeout: 0,
            onSnapshotCreateLogs: (chunk) => process.stdout.write(chunk),
          }
        );
      } else if (!snapshotNotFound) {
        throw snapshotError;
      }
    }

    if (!snapshotExists && !sandbox) {
      console.log(`Creating snapshot: ${snapshotName}`);
      try {
        await daytona.snapshot.create(
          {
            name: snapshotName,
            image,
          },
          {
            timeout: 0,
            onLogs: (chunk) => process.stdout.write(chunk),
          }
        );
      } catch (snapshotCreateError) {
        const snapshotCreateMessage =
          snapshotCreateError instanceof Error ? snapshotCreateError.message : String(snapshotCreateError);
        const forbidden = snapshotCreateMessage.toLowerCase().includes("forbidden");
        if (!forbidden) {
          throw snapshotCreateError;
        }

        console.log("Snapshot creation is forbidden in this Daytona target. Falling back to direct sandbox build.");
        sandbox = await daytona.create(
          {
            name,
            image,
            public: true,
            autoStopInterval,
            autoArchiveInterval,
            autoDeleteInterval,
          },
          {
            timeout: 0,
            onSnapshotCreateLogs: (chunk) => process.stdout.write(chunk),
          }
        );
      }
    }

    if (!sandbox) {
      sandbox = await daytona.create({
        name,
        snapshot: snapshotName,
        public: true,
        autoStopInterval,
        autoArchiveInterval,
        autoDeleteInterval,
      });
    }
  }

  console.log(`\nSandbox ready: ${sandbox.id} (name: ${name})`);
  console.log("When startup finishes, app should be on port 3000.");

  try {
    const preview = await sandbox.getPreviewLink(3000);
    console.log(`Preview URL: ${preview.url}`);
  } catch {
    console.log("Preview URL is not available yet. Try again once the app is fully booted.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
