// Library
const library = {
  
  storage: localStorage,

  getData: function () {
    if (this.storage.getItem('libraryData')) { 
      return JSON.parse(this.storage.getItem('libraryData')); 
    } else {
      return [];
    }
  },

  saveData: function (books) {
    this.storage.setItem('libraryData', JSON.stringify(books));
  }
}


// Book
function Book (bookInfo) {

  this.title = bookInfo.title;
  this.author = bookInfo.author;
  this.year = bookInfo.year;
  this.pages = bookInfo.pages;
  this.isRead = bookInfo.isRead || false;
}

Book.prototype.info = function () {  
  let info = this.title + ' by ' + this.author + ', ' + this.pages + ' pages';
  return info += this.isRead ? ' (read)' : ' (not read yet)';
}

Book.prototype.changeReadStatus = function () {
  this.isRead = !this.isRead;
}



// Library controller
const libraryController = {

  books: [],

  init: function () {
    library.getData().forEach((bookInfo) => {
      let book = new Book(bookInfo);
      this.books.push(book);  
    });

    libraryView.init();
  },

  getBooks: function () {
    return this.books;
  },

  addBook: function (bookInfo) {
    let book = new Book(bookInfo);
    this.books.push(book);
    library.saveData(this.books);

    libraryView.render();
  }, 

  removeBook: function (bookIndex) {
    this.books.splice(bookIndex, 1);
    library.saveData(this.books);


    libraryView.render();
  },

  changeReadStatus: function (bookIndex) {
    this.books[bookIndex].changeReadStatus();
    library.saveData(this.books);

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
      libraryController.addBook({
        title: this.bookTitleField.value,
        author: this.bookAuthorField.value,
        year: this.bookYearField.value
      });
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