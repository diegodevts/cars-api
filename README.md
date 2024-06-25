# Cars API

Esse projeto foi desenvolvido para a avaliação da empresa WS Work

## Tecnologias e metodologias utilizadas

**Back-end:** Node, Express, Prisma, PostgreSQL

**Devops:** Github Actions, Docker, Nginx

**Engenharia de software:** TDD (Test driven development), SOLID, Clean architecture

## Como executar o projeto

**Instalar as dependências:**

```console
npm install
```

**Gerar a build:**

```console
npm run build
```

**Executar a build e instalar as dependências extras com o docker:**

```console
docker-compose up --build
```

**Executar as migrations do prisma:**

```console
npx prisma migrate deploy
```

## Sobre a arquitetura do projeto

**Backend**

No backend eu optei pelo desenvolvimento utilizando a metodologia TDD - que é o desenvolvimento orientado a testes - a qual eu julgo
muito boa para projetos que tem propensão a escalabilidade, manutebilidade e disponibilidade, pelo fato de tenderem a ser aplicações críticas, cujas regras de domínio NÃO podem falhar em ambiente de produção (adicionei apenas um exemplo de testes unitário com os casos de uso). Como design pattern, eu optei pelo SOLID, o qual nos permite ter um controle e manutebilidade maior sobre uma aplicação totalmente desacoplada. Utilizei princípios de clean code como DRY, utilizando a estratégia de generic layers, pra não precisarmos repetir código, e o KISS, para mantermos a aplicação mais enxuta possível. Para a arquitetura, optei pela clean arquitecture, conhecida também como onion, separando regras de negócio por casos de uso. A aplicação tá bastante enxuta, ainda colocaria mais coisas, mas quis deixá-la o mais simples possível.

**Devops**

Na parte de devops, eu optei por colocar a aplicação com um proxy-reverso e um load balancer com round-robin em duas instâncias apenas, cujas instâncias podem ser verificadas com os seus respectivos ids, indo ao endpoint: http://app.cars/ , e recarregando para que seja direcionado a ambas (Após ter os passos de instalação completamente feitos).
Adicionei o proxy-reverso apenas para mostrar conhecimentos de segurança, e load balancing com round-robin para conhecimentos em escalabilidade e performance. Obviamente existem diversas outras técnicas que eu poderia ter utilizado para performance, como adicionando compressão gzip, adicionando workers, caching dentre outros.
Adicionei um pequeno exemplo de entrega contínua (CI/CD) com [Github actions](./.github/workflows/main.yml), onde eu "simulo" uma publishing da aplicação em produção, utilizando o Docker.

---
