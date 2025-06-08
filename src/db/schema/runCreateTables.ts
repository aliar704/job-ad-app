import { createRelations } from './createRelations';
import { createApplicationsTable } from './Tables/createApplicationsTable';
import { createCitiesTable } from './Tables/createCitiesTables';
import { createCompaniesTable } from './Tables/createCompaniesTable';
import { createJobAdsTable } from './Tables/createJobAdsTable';
import { createJobTagsTable } from './Tables/createJobTagsTable';
import { createLogsTable } from './Tables/createLogsTable';
import { createResumesTable } from './Tables/createResumesTable';
import { createTagsTable } from './Tables/createTagsTable';
import { createUsersTable } from './Tables/createUsersTable';

async function run() {
  try {
    await createUsersTable();
    await createCompaniesTable();
    await createCitiesTable();
    await createResumesTable();
    await createJobAdsTable();
    await createApplicationsTable();
    await createTagsTable();
    await createJobTagsTable();
    await createLogsTable();
    await createRelations();

    console.log('All tables & relations created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create tables:', err);
    process.exit(1);
  }
}

run();
