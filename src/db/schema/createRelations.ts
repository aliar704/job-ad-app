import pool from '../postgres';

export async function createRelations(): Promise<void> {
  try {
    // USERS → CITIES
    await pool.query(`
      ALTER TABLE users
      ADD CONSTRAINT fk_users_cities
      FOREIGN KEY (city_id) REFERENCES cities(id)
      ON DELETE SET NULL;
    `);
    // resumes → users
    await pool.query(`
      ALTER TABLE resumes
      ADD CONSTRAINT fk_resume_user
      FOREIGN KEY (jobseeker_id) REFERENCES users(id) ON DELETE CASCADE;
    `);

    // job_ads → users (employer)
    await pool.query(`
      ALTER TABLE job_ads
      ADD CONSTRAINT fk_job_ads_user
      FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE;
    `);

    // job_ads → companies
    await pool.query(`
      ALTER TABLE job_ads
      ADD CONSTRAINT fk_job_ads_company
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;`);

    // job_ads → cities
    await pool.query(`
      ALTER TABLE job_ads
      ADD CONSTRAINT fk_job_ads_city
      FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL;
    `);

    // applications → users
    await pool.query(`
      ALTER TABLE applications
      ADD CONSTRAINT fk_applications_user
      FOREIGN KEY (jobseekr_id) REFERENCES users(id) ON DELETE CASCADE;
    `);

    // applications → job_ads
    await pool.query(`
      ALTER TABLE applications
      ADD CONSTRAINT fk_applications_job_ad
      FOREIGN KEY (job_ad_id) REFERENCES job_ads(id) ON DELETE CASCADE;
    `);

    // applications → resumes
    await pool.query(`
      ALTER TABLE applications
      ADD CONSTRAINT fk_applications_resume
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL;
    `);
    // job_tags.job_ad_id → job_ads.id
    await pool.query(`
      ALTER TABLE job_tags
      ADD CONSTRAINT fk_job_tags_job_ads
      FOREIGN KEY (job_ad_id) REFERENCES job_ads(id)
      ON DELETE CASCADE;
    `);

    // job_tags.tag_id → tags.id
    await pool.query(`
      ALTER TABLE job_tags
      ADD CONSTRAINT fk_job_tags_tags
      FOREIGN KEY (tag_id) REFERENCES tags(id)
      ON DELETE CASCADE;
    `);

    //companies => cities
    await pool.query(`
      ALTER TABLE companies
      ADD CONSTRAINT fk_companies_cities
      FOREIGN KEY (city_id) REFERENCES cities(id)
      ON DELETE SET NULL;
    `);

    //companies => users

    await pool.query(`
      ALTER TABLE companies
      ADD CONSTRAINT fk_companies_users
      FOREIGN KEY (employer_id) REFERENCES users(id)
      ON DELETE CASCADE;
    `);

    console.log('All relations created.');
  } catch (error) {
    console.error('Error creating relations:', error);
    throw error;
  }
}
