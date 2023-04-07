const config = require("./config.json");

const today = new Date().toISOString().split("T")[0];

let body = JSON.stringify({
  collection: "pushups",
  database: "self-growth",
  dataSource: "Cluster0",
});

let options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key": config["api-key"],
    Accept: "application/json",
  },
  body: body,
};

async function main() {
  if (
    process.argv.length > 3 &&
    process.argv[2] === "add" &&
    Number.isInteger(parseInt(process.argv[3]))
  ) {
    let insertBody = JSON.stringify({
      collection: "pushups",
      database: "self-growth",
      dataSource: "Cluster0",
      document: { date: today, pushups: parseInt(process.argv[3]) },
    });

    let insertOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config["api-key"],
      },
      body: insertBody,
    };
    await fetch(config.url + "action/insertOne", insertOptions)
      .then(async (response) => {
        await response.json().then((r) => console.log(r));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (process.argv.length > 3 && process.argv[2] === "find") {
    let findOneBody = JSON.stringify({
      collection: "pushups",
      database: "self-growth",
      dataSource: "Cluster0",
      filter: { _id: { $oid: process.argv[3] } },
    });

    let findOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config["api-key"],
      },
      body: findOneBody,
    };

    await fetch(config.url + "action/findOne", findOptions)
      .then(async (response) => {
        await response.json().then((r) => console.log(r));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (process.argv.length > 2 && process.argv[2] === "findAll") {
    await fetch(config.url + "action/find", options)
      .then(async (response) => {
        await response.json().then((r) => console.log(r));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (process.argv.length > 4 && process.argv[2] === "updateOne") {
    let updateOneBody = JSON.stringify({
      collection: "pushups",
      database: "self-growth",
      dataSource: "Cluster0",
      filter: { _id: { $oid: process.argv[3] } },
      update: { $set: { date: process.argv[4] } },
      upsert: false,
    });

    let updateOneOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config["api-key"],
      },
      body: updateOneBody,
    };

    await fetch(config.url + "action/updateOne", updateOneOptions)
      .then(async (response) => {
        await response.json().then((r) => console.log(r));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  let aggrBody = JSON.stringify({
    collection: "pushups",
    database: "self-growth",
    dataSource: "Cluster0",
    pipeline: [
      {
        $group: { _id: null, Total: { $sum: "$pushups" } },
      },
    ],
  });

  let aggrOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": config["api-key"],
      Accept: "application/json",
    },
    body: aggrBody,
  };
  await fetch(config.url + "action/aggregate", aggrOptions)
    .then(async (response) => {
      await response
        .json()
        .then((r) =>
          console.log("Total pushups this year:", r.documents[0].Total)
        );
    })
    .catch((error) => {
      console.log(error);
    });
}

main();
