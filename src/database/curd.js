const anchorCreate = {
    anchor:(table_name='anchor') =>`CREATE TABLE ${table_name} (
    game_type varchar(100) NOT NULL,
    game_abbv varchar(100) NOT NULL,
    live_name varchar(100) NOT NULL,
    anchor_nick varchar(100) NOT NULL,
    watch_number int(11) NOT NULL,
    room_code varchar(100) NOT NULL,
    live_image blob,
    query_date datetime NOT NULL,
    room_link varchar(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    live_game:(table_name='live_game') => `CREATE TABLE ${table_name} (
        game_type varchar(100) NOT NULL,
        game_name varchar(100) NOT NULL,
        game_abbv varchar(100) NOT NULL,
        game_link varchar(100) NOT NULL,
        query_date datetime NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`

}
module.exports = {
    anchorCreate
}