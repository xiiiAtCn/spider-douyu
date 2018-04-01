const create = {
    live_game:(table_name='live_game') =>`CREATE TABLE ${table_name} (
        type_link varchar(100) NOT NULL,
        type_abbr varchar(100) NOT NULL,
        game_figure varchar(100) NOT NULL,
        type_name varchar(100) NOT NULL,
        query_date datetime NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    anchor:(table_name='anchor') => `CREATE TABLE ${table_name} (
        game_type varchar(100) NOT NULL,
        game_name varchar(100) NOT NULL,
        game_abbv varchar(100) NOT NULL,
        game_link varchar(100) NOT NULL,
        query_date datetime NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8`

}

const insert = {
    live_game: (table_name='live_game') => `insert into ${table_name}(
        \`type_link\`,
        \`type_abbr\`,
        \`game_figure\`,
        \`type_name\`
    )
    values ?`
}


module.exports = {
    create,
    insert
}