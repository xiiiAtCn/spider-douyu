const create = {
    live_game:(table_name='live_game') =>`CREATE TABLE ${table_name} (
        type_link varchar(100) NOT NULL,
        type_abbr varchar(100) NOT NULL,
        game_figure varchar(100) NOT NULL,
        type_name varchar(100) NOT NULL,
        type_tid int(10) NOT NULL,
        query_date timestamp NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    game_anchor:(table_name='game_anchor') => `CREATE TABLE ${table_name} (
        anchor_name varchar(100) NOT NULL,
        room_link varchar(100) NOT NULL,
        room_title varchar(100) NOT NULL,
        audience_number varchar(100),
        room_figure varchar(100),
        anchor_tags varchar(100),
        query_date timestamp NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8`

}

const insert = {
    live_game: (table_name='live_game') => `insert into ${table_name}(
        \`type_link\`,
        \`type_abbr\`,
        \`game_figure\`,
        \`type_name\`,
        \`type_tid\`
    )
    values ?`,
    game_anchor: (table_name='game_anchor') => `insert into ${table_name}(
        \`anchor_name\`,
        \`room_link\`,
        \`room_title\`,
        \`audience_number\`,
        \`room_figure\`,
        \`anchor_tags\`
    ) values ?`
}


module.exports = {
    create,
    insert
}