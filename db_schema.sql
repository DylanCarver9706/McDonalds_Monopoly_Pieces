-- =============================
-- RESET DATABASE
-- =============================
drop table if exists messages cascade;
drop table if exists chats cascade;
drop table if exists user_pieces cascade;
drop table if exists pieces cascade;
drop table if exists boards cascade;
drop table if exists users cascade;

-- =============================
-- USERS TABLE
-- =============================
create table users (
    id uuid primary key default gen_random_uuid(),
    clerk_user_id text not null unique, -- from Clerk auth
    username text not null unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================
-- BOARDS TABLE
-- =============================
create table boards (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    year int not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================
-- PIECES TABLE
-- =============================
create table pieces (
    id uuid primary key default gen_random_uuid(),
    section text not null,
    name text not null,
    board_order int not null,
    color text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================
-- USER_PIECES TABLE (join)
-- =============================
create table user_pieces (
    user_id uuid not null references users(id) on delete cascade,
    board_id uuid not null references boards(id) on delete cascade,
    piece_id uuid not null references pieces(id) on delete cascade,
    city_acquired text,
    state_acquired text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    primary key (user_id, board_id, piece_id)
);

-- ✅ Create index after table creation for faster queries
create index idx_user_pieces_piece_id on user_pieces (piece_id);

-- =============================
-- CHATS TABLE
-- =============================
create table chats (
    id uuid primary key default gen_random_uuid(),
    user1_id uuid not null references users(id) on delete cascade,
    user2_id uuid not null references users(id) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user1_id, user2_id)
);

-- =============================
-- MESSAGES TABLE
-- =============================
create table messages (
    id uuid primary key default gen_random_uuid(),
    chat_id uuid not null references chats(id) on delete cascade,
    sender_id uuid not null references users(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================
-- SEED DATA: MONOPOLY PIECES
-- =============================
insert into pieces (section, name, board_order, color) values
('Brown',       'Mediterranean Avenue',     1,      '#904436'),
('Brown',       'Baltic Avenue',            2,      '#904436'),
('Light Blue',  'Oriental Avenue',          3,      '#bee7f9'),
('Light Blue',  'Vermont Avenue',           4,      '#bee7f9'),
('Light Blue',  'Connecticut Avenue',       5,      '#bee7f9'),
('Pink',        'St. Charles Place',        6,      '#a2327e'),
('Pink',        'States Avenue',            7,      '#a2327e'),
('Pink',        'Virginia Avenue',          8,      '#a2327e'),
('Orange',      'St. James Place',          9,      '#f7852c'),
('Orange',      'Tennessee Avenue',         10,     '#f7852c'),
('Orange',      'New York Avenue',          11,     '#f7852c'),
('Red',         'Kentucky Avenue',          12,     '#eb3729'),
('Red',         'Indiana Avenue',           13,     '#eb3729'),
('Red',         'Illinois Avenue',          14,     '#eb3729'),
('Yellow',      'Atlantic Avenue',          15,     '#fff301'),
('Yellow',      'Ventnor Avenue',           16,     '#fff301'),
('Yellow',      'Marvin Gardens',           17,     '#fff301'),
('Green',       'Pacific Avenue',           18,     '#36b460'),
('Green',       'North Carolina Avenue',    19,     '#36b460'),
('Green',       'Pennsylvania Avenue',      20,     '#36b460'),
('Dark Blue',   'Park Place',               21,     '#3081c3'),
('Dark Blue',   'Boardwalk',                22,     '#3081c3'),
('Railroad',    'Reading Railroad',         23,     '#808080'),
('Railroad',    'Pennsylvania Railroad',    24,     '#808080'),
('Railroad',    'B&O Railroad',             25,     '#808080'),
('Railroad',    'Short Line',               26,     '#808080'),
('Utility',     'Electric Company',         27,     '#FFFFE0'),
('Utility',     'Water Works',              28,     '#ADD8E6');
