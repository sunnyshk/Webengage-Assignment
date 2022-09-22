const fs = require("fs");

const csv = require("csv-parser");

//Initializing a results array in which we will store the data from the csv file
let results = [];

//Initializing a headersUpdatedArr in which we will store all the data in json fromat with updated header values as object keys
let headersUpdatedArr = [];

//This fuction will help us to read the data from the csv file
const readFile = () => {
  //reading the data using csv-parser library
  fs.createReadStream("sample_users_data.csv")
    .pipe(csv())
    //Here we are storing all the data from csv file to the results array
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results.forEach((item) => {
        //Here we are splitting each item(Object) into an array
        let arr = Object.entries(item);

        //Here we are taking a keysArr where we are storing all the headers which will replace the cureent default csv file headers
        let keyArr = [
          "user_id",
          "first_name",
          "last_name",
          "phone",
          "email",
          "gender",
          "age_category",
          "birthdate",
          "country",
          "reg_date",
        ];

        //Taking an empty object where we will store and map updated headers will correct data
        let obj = {};

        //Running a for loop on the splitted array so that we can store the right key value pairs
        for (let i = 0; i < arr.length; i++) {
          //Here all the key value pairs will be mapped in the empty object
          if (
            obj[keyArr[i]] == undefined &&
            keyArr[i] != "birthdate" &&
            keyArr[i] != "reg_date"
          ) {
            obj[keyArr[i]] = arr[i][1];
          }
          //Logic for getting the expected date format from schema
          else {
            let data = arr[i][1];
            let res = data.slice(0, 10);
            let formatedDate = res.split("-").reverse().join("-");
            obj[keyArr[i]] = " " + formatedDate;
          }
        }
        //Here we push the updated object to the headersUpdatedArr
        headersUpdatedArr.push(obj);
      });
      jsonToCsv(headersUpdatedArr);
    });
};
readFile();

//This function will take the data as a parameter and convert the data to a csv file
function jsonToCsv(data) {
  //Initializing a finalCsvArr array where we will store final updated data
  let finalCsvArr = [];

  //Taking out all the headers(Keys) from updated data and pushing it to the array above
  let header = Object.keys(data[0]);
  finalCsvArr.push(header);

  //Running a forEach loop on the data and now we are pushing all the values
  data.forEach((itm) => {
    finalCsvArr.push(Object.values(itm));
  });

  //Now splitting out finalArray into multipe lines to get the correct csv format
  finalCsvArr = finalCsvArr.join("\r\n");

  //Finally writing a file output.csv which will be created with the data of finalCsvArr into the root folder when we run the code
  fs.writeFile("output.csv", finalCsvArr, (err, dta) => {
    if (err) {
      return console.log(err);
    }
  });
}
