// Create an array of objects
books = [
    { title: "C++", author: "Bjarne" },
    { title: "Java", author: "James" },
    { title: "Python", author: "Guido" },
    { title: "Java", author: "James" },
];

// Display the list of array objects
console.log(books);

// Declare a new array
let newArray = [];

// Declare an empty object
let uniqueObject = {};
for (let i in books) {

    // Extract the title
    let objTitle = books[i]['title'];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
}

console.log("lskflksdflkklsd====>", uniqueObject)

// Loop to push unique object into array
for (i in uniqueObject) {
    newArray.push(uniqueObject[i]);
}

// Display the unique objects
console.log(newArray);
