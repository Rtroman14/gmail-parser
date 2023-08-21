const _ = require("../src/Helper");

const reonomy = async (stormSwaths) => {
    try {
        console.log("typeof stormSwaths:", typeof stormSwaths);
        // console.log("stormSwaths:", stormSwaths);

        // TODO: scrape reonomy
        console.log("wait 5 minutes");
        await _.wait(5);
        console.log("done waiting 5 minutes");

        return stormSwaths;
    } catch (error) {
        console.error(`Scraper > reonomy -- ${JSON.stringify(error.message)}`);
        return false;
    }
};

// const reonomy = async (req, res) => {
//     const { stormSwaths } = req.body;

//     try {
//         console.log("typeof req.body:", typeof req.body);

//         console.log("typeof stormSwaths:", typeof stormSwaths);
//         console.log("stormSwaths:", stormSwaths);

//         res.json({ reqBody: req.body });

//         // TODO: scrape reonomy
//         console.log("wait 5 minutes");
//         await _.wait(5);
//         console.log("done waiting 5 minutes");
//     } catch (error) {
//         console.error(`Scraper > reonomy -- ${JSON.stringify(error.message)}`);

//         res.status(500).send({ data: undefined, message: error.message });
//     }
// };

module.exports = { reonomy };
