let timestamp = Date.now()
const anchorCreate = {
    sql:(table_name) =>`CREATE TABLE ${table_name} (
    game_abbv varchar(100) NOT NULL,
    live_name varchar(100) NOT NULL,
    anchor_nick varchar(100) NOT NULL,
    watch_number int(11) NOT NULL,
    room_code varchar(100) NOT NULL,
    live_image blob,
    query_date datetime NOT NULL,
    room_link varchar(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
}
module.exports = {
    anchorCreate
}