// Book
function Book (title, author, pages, isRead=false) {

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;

}

Book.prototype.info = function () {  
  let info = this.title + ' by ' + this.author + ', ' + this.pages + ' pages';
  return info += this.isRead ? ' (read)' : ' (not read yet)';
}

// Library
const library = []



// Library controller
const libraryController = {

  init: function () {
    libraryView.init();
  },

  getBooks: function () {
    return library;
  },

  addBook: function (title, author, pages, isRead) {
    let book = new Book(title, author, pages, isRead);
    library.push(book);

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
    books.forEach((book) => {

      // render a book
      let bookEl = document.createElement('TR');
      this.bookListEl.append(bookEl);

      for (let prop in book) {
        if (book.hasOwnProperty(prop)) {  
          let propEl = document.createElement('TD');
          propEl.textContent = book[prop];
          bookEl.append(propEl);
        }
      }      

    });
  }

}


libraryController.init();