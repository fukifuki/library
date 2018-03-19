// Book
function Book (title, author, pages, isRead=false) {

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;

}

// Book.prototype.info = function () {  
//   let info = this.title + ' by ' + this.author + ', ' + this.pages + ' pages';
//   return info += this.isRead ? ' (read)' : ' (not read yet)';
// }

// Book.prototype.changeReadStatus = function () {
//   this.isRead = !this.isRead;
// }


// Library
// let library = [];

// localStorage.setItem('library', JSON.stringify(library));

const library = {
  
  books: null,

  setBooks: function () {
    if (localStorage.getItem('books')) {
      this.books = JSON.parse(localStorage.getItem('books'));
    } else {
      this.books = [];
      localStorage.setItem('books', JSON.stringify(this.books));
    }
  },

  getBooks: function () {
    this.books = JSON.parse(localStorage.getItem('books'));
    return this.books;

  },

  saveBook: function (book) {
    this.books.push(book);
    localStorage.setItem('books', JSON.stringify(this.books));
  },

  removeBook: function (bookIndex) {
    this.books.splice(bookIndex, 1);
    localStorage.setItem('books', JSON.stringify(this.books));
  },

  changeReadStatus: function (bookIndex) {
    let book = this.books[bookIndex];
    book.isRead = !book.isRead;
    localStorage.setItem('books', JSON.stringify(this.books));
  }
}


// Library controller
const libraryController = {

  init: function () {
    library.setBooks();

    libraryView.init();
  },

  getBooks: function () {
    return library.getBooks();
  },

  addBook: function (title, author, pages, isRead) {
    let book = new Book(title, author, pages, isRead);
    library.saveBook(book);

    libraryView.render();
  }, 

  removeBook: function (bookIndex) {
    library.removeBook(bookIndex);

    libraryView.render();
  },

  changeReadStatus: function (bookIndex) {
    library.changeReadStatus(bookIndex);

    libraryView.render();
  }
}


// Library view
const libraryView = {

  init: function () {
    this.bookListEl = document.querySelector('#book-list');

    this.newBookButtonEl = document.querySelector('#new-book-button');
    this.newBookFormEl = document.querySelector('#new-book-form');

    this.bookTitleField = document.querySelector('#book-title');
    this.bookAuthorField = document.querySelector('#book-author');
    this.bookYearField = document.querySelector('#book-year');

    this.addBookButton = document.querySelector('#add-book-button');
  

    this.addBookButton.addEventListener('click', () => {
      let title = this.bookTitleField.value;
      let author = this.bookAuthorField.value;
      let year = this.bookYearField.value;
      libraryController.addBook(title, author, year);
    });

    this.render();  
  },

  render: function () {
    this.bookListEl.innerHTML = '';

    let books = libraryController.getBooks();

    // render books list
    books.forEach((book, index) => {

      // render a book
      let bookEl = document.createElement('TR');
      this.bookListEl.append(bookEl);

      for (let prop in book) {
        if ((book.hasOwnProperty(prop)) && (prop !== 'isRead')) {  
          let propEl = document.createElement('TD');
          propEl.textContent = book[prop];
          bookEl.append(propEl);
        }
      }

      // render a read/not read toggle button
      let readToggleCell = document.createElement('TD');
      bookEl.append(readToggleCell);

      let readToggleButton = document.createElement('button');
      readToggleButton.textContent = book.isRead ? 'Read' : 'Not read';

      readToggleCell.append(readToggleButton);

      readToggleButton.addEventListener('click', () => {
        libraryController.changeReadStatus(index);
      });

      // render a remove button 
      let removeButtonCell = document.createElement('TD')
      bookEl.append(removeButtonCell);

      let removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButtonCell.append(removeButton);

      removeButton.addEventListener('click', () => {
        libraryController.removeBook(index);
      });
    });
  }

}


libraryController.init();