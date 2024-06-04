const express = require("express");
const fs = require("fs");
require("dotenv").config();
const fsPromises = require("fs/promises");
const { isObjectIdOrHexString } = require("mongoose");
const app = express();
const Category = require("./model/category");
const Author = require("./model/author");
const mongoose = require("mongoose");
const dbconnect = require("./dbConnect/connectMongo");
dbconnect();
app.get("/", async (req, res) => {
  try {
    const data = await fsPromises.readFile("data.json");
    const dataObject = JSON.parse(data); // Assuming data is valid JSON

    // const transformedArray = [];
    // for (const key in dataObject) {
    //   transformedArray.push({
    //     name: key,
    //     description: "Extract description from dataObject here", // Make dynamic
    //   });
    // }

    // const dataToWrite = JSON.stringify(transformedArray, null, 2);
    // await fsPromises.writeFile("category.json", dataToWrite);
    // console.log("Ghi file thành công: category.json");
    // res.send("Data processed successfully!");

    const transformedArrayBook = [];
    var i = 0;
    for (const category in dataObject) {
      const resAuthor = await Author.findOne({ name: `Peter James${i}` });
      i++;
      const respone = await Category.findOne({ name: category });
      dataObject[category].forEach((item) => {
        transformedArrayBook.push({
          name: item.bookTitle,
          description: item.bookDescription,
          image: item.imagesUrl,
          price: item.bookPrice,
          totalRating: 5,
          quantity: item.available,
          categoryId: respone._id,
          authorId: resAuthor._id,
        });
      });
    }
    const dataToWrite = JSON.stringify(transformedArrayBook, null, 2);
    await fsPromises.writeFile("book.json", dataToWrite);
    console.log("Ghi file thành công: book.json");
    res.send("Data processed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing data");
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
