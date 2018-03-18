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



