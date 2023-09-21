document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("book-form");
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const isCompleteSelect = document.getElementById("isComplete");
  const belumSelesaiList = document.getElementById("belumSelesaiList");
  const selesaiList = document.getElementById("selesaiList");

  bookForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = titleInput.value;
      const author = authorInput.value;
      const year = yearInput.value;
      const isComplete = isCompleteSelect.value === "true";

      const book = {
          id: +new Date(),
          title,
          author,
          year: parseInt(year),
          isComplete,
      };

      saveBook(book);
      addBookToList(book);

      titleInput.value = "";
      authorInput.value = "";
      yearInput.value = "";
      isCompleteSelect.selectedIndex = 0;
  });

  function saveBook(book) {
      let books = getBooks();
      books.push(book);
      localStorage.setItem("books", JSON.stringify(books));
  }

  function getBooks() {
      let books = localStorage.getItem("books");
      return books ? JSON.parse(books) : [];
  }

  function addBookToList(book) {
      const li = document.createElement("li");
      li.innerHTML = `Judul: ${book.title}<br>Author: ${book.author}<br>Tahun: ${book.year}`;


      const buttonContainer = document.createElement("div");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus";
      deleteButton.classList.add("btn");
      deleteButton.classList.add("btn-error");
      deleteButton.classList.add("mx-2");
      deleteButton.classList.add("my-2");
      deleteButton.addEventListener("click", function () {
          deleteBook(book);
      });
      buttonContainer.appendChild(deleteButton);

      const moveButton = document.createElement("button");
      moveButton.textContent = book.isComplete ? "Pindahkan ke Belum Selesai" : "Pindahkan ke Selesai Dibaca";
      moveButton.classList.add("btn");
      moveButton.classList.add("btn-active");
      moveButton.classList.add("btn-neutral");
      moveButton.classList.add("mx-2");
      moveButton.classList.add("my-2");
      moveButton.addEventListener("click", function () {
          moveBook(book);
      });
      buttonContainer.appendChild(moveButton);

      li.appendChild(buttonContainer);

      if (book.isComplete) {
          selesaiList.appendChild(li);
      } else {
          belumSelesaiList.appendChild(li);
      }
  }

  function deleteBook(book) {
    console.log("delete:", book);
      const books = getBooks();
      const index = books.findIndex(b => b.id === book.id);

      if (index !== -1) {
          books.splice(index, 1);
          localStorage.setItem("books", JSON.stringify(books));

          
          const listToRemoveFrom = book.isComplete ? selesaiList : belumSelesaiList;
          const lis = listToRemoveFrom.querySelectorAll("li");
          for (const li of lis) {
              if (li.innerHTML.includes(`Judul: ${book.title}<br>Author: ${book.author}`)) {
                  listToRemoveFrom.removeChild(li);
                  break; 
              }
          }
      }
  }

  function moveBook(book) {
      console.log("Move:", book);
      const books = getBooks();
      const index = books.findIndex(b => b.id === book.id);

      if (index !== -1) {
          books[index].isComplete = !book.isComplete;
          localStorage.setItem("books", JSON.stringify(books));

          const listToRemoveFrom = book.isComplete ? selesaiList : belumSelesaiList;
          const lis = listToRemoveFrom.querySelectorAll("li");
          for (const li of lis) {
              if (li.innerHTML.includes(`Judul: ${book.title}<br>Author: ${book.author}`)) {
                  listToRemoveFrom.removeChild(li);
                  break; 
              }
          }

          addBookToList(books[index]);
      }
  }


  
  function loadBooks() {
      const books = getBooks();
      books.forEach(book => {
          addBookToList(book);
      });
  }

  loadBooks();
});
