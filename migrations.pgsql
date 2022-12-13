DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    name TEXT,
    kind TEXT
);

INSERT INTO pets (id, age, name, kind) VALUES (0, 1, 'Freya', 'Dog');
INSERT INTO pets (age, name, kind) VALUES (2, 'Seymore', 'Cat');