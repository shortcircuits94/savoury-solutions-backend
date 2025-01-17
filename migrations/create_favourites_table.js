export async function up(knex) {
  await knex.schema.createTable("favourites", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("recipe_id").notNullable();
    table.string("recipe_name").notNullable();
    table.text("recipe_image").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable("favourites");
}
