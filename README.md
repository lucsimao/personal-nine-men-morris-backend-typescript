# Node Api Template

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

This is a Nine Men Moris node js game implemented as a socket practice.

## Authors

- [@lucsimao](https://www.github.com/lucsimao)

# Summary

- [Requirements](#Requirements)
- [Installation](#Installation)
- [Test](#Test)
- [Techs](#Techs)
- [References](#References)

# Installation

To install this project, run the following commands:

```
$ git clone https://github.com/lucsimao/testlink-facade-api
```

- For npm users

```
  $ npm install
  $ npm start
```

- For yarn users:

```
$ yarn install
$ yarn start
```

### Elastic Search

If elastic search does not work in docker, a max_map_count configuration may be necessary as suggested at [ElasticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#_set_vm_max_map_count_to_at_least_262144) official page.

For windows users

```sh
wsl -d docker-desktop
sysctl -w vm.max_map_count=262144
```

For linux users

```sh
grep vm.max_map_count /etc/sysctl.conf
vm.max_map_count=262144
```

For MacOS or Windows without WSL

```sh
docker-machine ssh
sudo sysctl -w vm.max_map_count=262144
```

# Test

To execute this project tests, you must run the following commands:

- **Unit Tests**

  ```
  $ npm run test:unit
  ```

  or

  ```
  $ yarn test:unit
  ```

- **Functional Tests**

```
$ npm run test:functional
```

```
$ yarn test:functional
```

- **Lint**

```
$ npm run lint
```

or

```
$ yarn lint
```

- **Style Check**
  `` npm run style:check`  ``npm run style:fix`or`yarn style:check` `yarn style:fix`

- **All Tests**
  ```npm test`
  or
  `yarn test`

# Techs

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/VisualStudioCode-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

In this project, we used the following technologies:

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)- Text editor with following plugins installed: [DotENV](https://github.com/mikestead/vscode-dotenv), [ESLint](https://github.com/Microsoft/vscode-eslint), [GitLens](https://github.com/eamodio/vscode-gitlens) e [vscode-icons](https://github.com/vscode-icons/vscode-icons).
- [Jest](https://jestjs.io/) - Javascript Test Framework.
- [ESLint](https://github.com/eslint/eslint) - ESLint to padronize the project code.
- [Prettier](https://prettier.io/) - To format code automatically.
- [Stryker](https://stryker-mutator.io/docs/General/dashboard/) - To run mutation tests in project and use mutation badges.

# References

- [Waldemar Neto - DO ZERO A PRODUÇÃO: APRENDA A CONSTRUIR UMA API NODE.JS COM TYPESCRIPT ](https://github.com/waldemarnt/node-typescript-api)
- [@brunohafonso95](https://github.com/brunohafonso95)
- [Glaucia Lemos - Curso Typescript Zero To Hero](https://github.com/glaucia86/curso-typescript-zero-to-hero)
- [Alura - Formação Node JS](https://cursos.alura.com.br/formacao-node-js-12)
- [NodeJS Integration Test Best Practices](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [NodeJS Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Javascript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Filipe Deschamps - meu-primeiro-jogo-multiplayer](https://github.com/filipedeschamps/meu-primeiro-jogo-multiplayer)
