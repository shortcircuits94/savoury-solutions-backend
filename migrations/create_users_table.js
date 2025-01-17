export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns
  });
}

export async function down(knex) {
  await knex.schema.dropTable("users");
}
