cognitev-task
---

## Setup

- You need to have `nodejs` and `npm` installed on your machine.
    You also need a working account/role on a`mysql` server
- Create a new Database and put your config in `config/config.json`
- Run `npm install` to install all the dependencies
- Run `npx sequelize-cli db:migrate` to load the database
    migrations
- Run `node app.js` to run the server