const DB = require("../src/DB");

// CREATE
// DB.create({ historyID: 6233 });

(async () => {
    try {
        const { historyID } = await DB.getLast();
        console.log(historyID);
    } catch (error) {
        console.error(error);
    }
})();

// READ
// repo.getAll().then((all) => console.log(all));

// repo.getUser("dab45d9a").then((user) => console.log(user));

// repo.getUserBy({ lastName: "Roman" }).then((user) => console.log(user));

// UPDATE
// repo.update("dab45d9a", { age: 26 }).then((user) => console.log(user));
