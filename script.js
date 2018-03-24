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
  this.pages = bookInfo.pages;
  this.year = bookInfo.year;
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

    this.formContainerEl = document.querySelector('#form-container')
    this.newBookFormEl = document.querySelector('#new-book-form');

    this.bookTitleField = document.querySelector('#book-title');
    this.bookAuthorField = document.querySelector('#book-author');
    this.bookPagesField = document.querySelector('#book-pages');
    this.bookYearField = document.querySelector('#book-year');

    this.addBookButton = document.querySelector('#add-book-button');
    this.exitFormButton = document.querySelector('#exit-form-button');

    // hide form after the page loads
    document.addEventListener('DOMContentLoaded', () => {
      this.formContainerEl.style.visibility = 'hidden';
    });

    // show form when user clicks new book button
    this.newBookButtonEl.addEventListener('click', () => {
      this.formContainerEl.style.visibility = 'visible';
      this.newBookButtonEl.style.visibility = 'hidden';
    }) 

    // add book to the list when user click add book button
    this.addBookButton.addEventListener('click', () => {
      libraryController.addBook({
        title: this.bookTitleField.value,
        author: this.bookAuthorField.value,
        pages: this.bookPagesField.value,
        year: this.bookYearField.value
      });

      // clear input fields
      [this.bookTitleField, this.bookAuthorField, 
        this.bookPagesField, this.bookYearField].forEach((el) => {
          el.value = '';
        });


      // hide form again
      this.formContainerEl.style.visibility = 'hidden';
      this.newBookButtonEl.style.visibility = 'visible';
    });

    this.exitFormButton.addEventListener('click', () => {
      this.formContainerEl.style.visibility = 'hidden';
      this.newBookButtonEl.style.visibility = 'visible';
    });

    this.render();  
  },

  render: function () {
    this.bookListEl.innerHTML = '';

    let books = libraryController.getBooks(); 

    // render books list
    books.forEach((book, index) => {

      // render a book row
      let bookEl = document.createElement('TR');
      this.bookListEl.append(bookEl);

      // render a remove button 
      let removeButtonCell = document.createElement('TD')
      bookEl.append(removeButtonCell);

      let removeButton = document.createElement('button');
      removeButton.textContent = '\xD7';
      removeButton.classList.add('book-button')
      removeButton.classList.add('remove-button');
      removeButtonCell.append(removeButton);

      removeButton.addEventListener('click', () => {
        libraryController.removeBook(index);
      });

      // add book info columns
      for (let prop in book) {
        if ((book.hasOwnProperty(prop)) && (prop !== 'isRead')) {  
          let propEl = document.createElement('TD');
          propEl.textContent = book[prop];
          propEl.classList.add(prop);
          bookEl.append(propEl);
        }
      }

      // render a read/not read toggle button
      let readToggleCell = document.createElement('TD');
      bookEl.append(readToggleCell);

      let readToggleButton = document.createElement('button');
      readToggleButton.textContent = book.isRead ?  '\u2713' : '';
      readToggleButton.classList.add('book-button');
      if (book.isRead) { 
        readToggleButton.classList.add('read-toggle-button-clicked');
      } 

      readToggleCell.append(readToggleButton);

      readToggleButton.addEventListener('click', () => {
        libraryController.changeReadStatus(index);
      });

    });
  }
}


libraryController.init();