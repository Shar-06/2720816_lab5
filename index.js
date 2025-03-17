//import express
const express = require('express');

//set up express to create and config an app
const app = express();
app.use(express.json());

//set up port route
const PORT = 3000;

let books = [];
let bookId = 1;
let detailId = 1;


//1. Returns an object with your student number.
app.get("/whoami", (req, res) => {
    const studentNum = {
        "Student_Number": "2720816"
    };

    res.send(studentNum);
});


//2. Returns a list of all books.
app.get("/books", (req, res) => {
    res.json(books);
});


//3. Returns details of a specific book
app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book){
        return res.status(404).json({error: "Not Found"});
    }
    res.json(books);
});


//4. Adds a new book to the collection
app.post("/books", (req, res) => {
    const {title, author, genre, publicationYear} = req.body;
    if(!title || !author || !genre || !publicationYear){
        return res.status(400).json({error: 'Bad Request'});
    }

    const newBook = {
        id: bookId++,
        title,
        details: [
            {
                id: detailId++,
                author,
                genre,
                publicationYear
            }
        ]
    };
    books.push(newBook);
    res.status(201).json(newBook);
});


//5. Updates an existing book's information.
app.put("/books/:id", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book){
        return res.status(404).json({error: "Not Found"});
    }

    const {title, author, genre, publicationYear} = req.body;
    if(title){ 
        book.title = title;
    }
    if (author || genre || publicationYear) {
        const lastDetail = book.details[book.details.length - 1]; // Get the most recent detail entry

        if (author) lastDetail.author = author;
        if (genre) lastDetail.genre = genre;
        if (publicationYear) lastDetail.publicationYear = publicationYear;
    }
    res.json(books);
});


//6. Deletes a book from the collection.
app.delete("/books/:id", (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1){
        return res.status(404).json({error: "Not Found"});
    }
    books.splice(index, 1);
    res.json({message: "Book Deleted Successfully"});
});


//7. Adds a detail
app.post("/books/:id/details", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book){
        return res.status(404).json({error: "Not Found"});
    }

    const {author, genre, publicationYear} = req.body;
    if(!author || !genre || !publicationYear){
        return res.status(400).json({error: 'Bad Request'});
    }

    book.details.push({author, genre, publicationYear});
    res.json(book);
});


//8. Removes a detail from a book.
app.delete("/books/:id/details/:detailId", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    const detailIndex = book.details.findIndex(d => d.id === parseInt(req.params.detailId));
    if (detailIndex === -1) {
        return res.status(404).json({ error: "Detail not found" });
    }

    book.details.splice(detailIndex, 1);
    
    res.json(book);
});

//Start server on the port
app.listen(PORT, () => {
    console.log(`Server Running On http://localhost:${PORT}`)
});