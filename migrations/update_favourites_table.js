export async function up(knex) {
  await knex.schema.alterTable("favourites", (table) => {
    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("favourites", (table) => {
    table.dropForeign("user_id");
    table.dropColumn("user_id");
  });
}
