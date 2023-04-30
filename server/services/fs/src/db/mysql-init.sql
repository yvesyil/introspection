DROP DATABASE IF EXISTS fs;
CREATE DATABASE IF NOT EXISTS fs;
USE fs;

DROP TABLE IF EXISTS file;

CREATE TABLE file (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(100) DEFAULT 'text',
      content TEXT,
      parentId INT NOT NULL
);

DROP TABLE IF EXISTS directory;

CREATE TABLE directory (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       userId INT NOT NULL,
       name VARCHAR(100) NOT NULL,
       root BOOLEAN DEFAULT FALSE,
       parentId INT
);

INSERT INTO file (userId, name, type, content, parentId) VALUES (1, 'main.c', 'c-source', '// paste your code here
#include <stdio.h>

int main(void)
{
    printf("Hello, World!");
    return 0;
}', 1);
INSERT INTO file (userId, name, type, content, parentId) VALUES (1, 'temp.txt', 'text', 'Lorem ipsum dolor sit amet.', 2);

INSERT INTO directory (userId, name, root, parentId) VALUES (1, 'root', TRUE, NULL);
INSERT INTO directory (userId, name, parentId) VALUES (1, 'test', 1);

