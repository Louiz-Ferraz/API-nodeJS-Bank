-- CREATE DATABASE dindin;
-- DROP TABLE IF EXISTS transacoes;
-- DROP TABLE IF EXISTS categorias;
-- DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL NOT NULL PRIMARY KEY,
  descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transacoes (
  id SERIAL NOT NULL PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor INTEGER NOT NULL,
  data DATE NOT NULL,
  categoria_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  tipo VARCHAR(7) NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

INSERT INTO categorias
(descricao)
VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');