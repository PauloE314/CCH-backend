import { createConnection, MigrationExecutor } from 'typeorm';
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { execSync } from 'child_process';

class Database {
  async migrate() {
    const connection = await createConnection();

    const migrations = new MigrationExecutor(connection);

    await migrations.executePendingMigrations();

    await connection.close();
  }

  async setup() {
    await createDatabase({ ifNotExist: true });

    await this.migrate();
  }

  async reset() {
    await dropDatabase({ ifExist: true });

    await this.setup();
  }
}

const db = new Database();

switch (process.argv[2]) {
  case 'migrate':
    db.migrate();
    break;
  case 'setup':
    db.setup();
    break;
  case 'reset':
    db.reset();
    break;
  default:
    execSync(
      `yarn ts-node-dev ./node_modules/typeorm/cli.js ${process.argv
        .slice(2)
        .join(' ')}`
    );
}
