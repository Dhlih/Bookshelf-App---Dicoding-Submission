// Do your work here...
const addBookForm = document.querySelector(".add-book-form");
const openFormBtn = document.querySelector(".open-form-button");
const closeFormBtn = document.querySelector(".close-form-button");
const bookFormSubmit = document.getElementById("bookFormSubmit");
const bookFormTitle = document.getElementById("bookFormTitle");
const bookFormAuthor = document.getElementById("bookFormAuthor");
const bookFormYear = document.getElementById("bookFormYear");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const test = document.querySelector(".test");
const searchBookTitle = document.getElementById("searchBookTitle");
const searchSubmit = document.getElementById("searchSubmit");
const bookItems = [];

searchSubmit.addEventListener("click", (evt) => {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  evt.preventDefault();
  const value = searchBookTitle.value.toLowerCase();

  if (value === "") {
    for (item of bookItems) {
      renderElement(item);
    }
  }
  bookItems.filter((el) => {
    el.title === value ? renderElement(el) : "";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (typeof Storage === undefined) {
    return;
  }
  loadDataFromStorage();
});

openFormBtn.addEventListener("click", () => {
  showAndHidden(addBookForm, 1);
});

closeFormBtn.addEventListener("click", () => {
  showAndHidden(addBookForm, 2);
});

bookFormSubmit.addEventListener("click", (evt) => {
  evt.preventDefault();
  const bookTitle = bookFormTitle.value;
  const bookAuthor = bookFormAuthor.value;
  const bookYear = Number(bookFormYear.value);
  const checkboxChecked = bookFormIsComplete.checked;

  if (bookTitle.trim() === "" || bookAuthor.trim() === "") {
    alert("Semua wajib diisi");
    return;
  }

  const book = generateObject(
    generateId(),
    bookTitle,
    bookAuthor,
    bookYear,
    checkboxChecked
  );

  bookItems.push(book);

  showAndHidden(addBookForm, 2);
  renderElement(book, checkboxChecked);

  resetValue();
});

function resetValue() {
  bookFormTitle.value = "";
  bookFormAuthor.value = "";
  bookFormYear.value = "";
  bookFormIsComplete.checked = false;
}

function generateObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function showAndHidden(el1, condition) {
  if (condition === 1) {
    el1.classList.remove("hidden");
    el1.classList.add("show");
  } else {
    el1.classList.add("hidden");
    el1.classList.remove("show");
  }
}

function generateId() {
  return +new Date();
}

function renderElement(book) {
  const element = document.createElement("div");
  element.classList.add("book-item");
  const elementId = book.id;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    book.title
  )}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let thumbnail =
        data.items[0]?.volumeInfo?.imageLinks?.smallThumbnail ||
        "img/cover.jpg";

      element.innerHTML = `
        <div class="left-side">
          <div data-bookid="${elementId}" data-testid="bookItem">
            <h3 data-testid="bookItemTitle">Judul: ${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun terbit: ${book.year}</p>
            <div class="button-group">
              <button class="changeStatusBtn" data-testid="bookItemIsCompleteButton">
                ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
              </button>
              <button class="delBtn" data-testid="bookItemDeleteButton">
                  <img src="img/trash.png" alt="Hapus">
              </button>
              <button data-testid="bookItemEditButton" class="editBtn">Edit</button>

            </div>
            
          </div>
        </div>
        <img src="${thumbnail}" alt="Thumbnail Buku">
      `;

      if (book.isComplete) {
        completeBookList.appendChild(element);
      } else {
        incompleteBookList.appendChild(element);
      }

      element.querySelector(".delBtn").addEventListener("click", () => {
        element.remove();
        bookItems.splice(bookItems.indexOf(book), 1);
        saveData();
      });

      element.querySelector(".editBtn").addEventListener("click", () => {
        alert("fitur belum ada");
      });

      element
        .querySelector(".changeStatusBtn")
        .addEventListener("click", () => {
          book.isComplete = !book.isComplete;
          element.remove();
          renderElement(book);
        });
      saveData();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// drag element function
addBookForm.addEventListener("mousedown", (e) => {
  if (e.target.closest("input") || e.target.closest("textarea")) return;

  const offsetX = e.clientX - addBookForm.getBoundingClientRect().left;
  const offsetY = e.clientY - addBookForm.getBoundingClientRect().top;

  const onMouseMove = (event) => {
    addBookForm.style.left = `${event.clientX - offsetX}px`;
    addBookForm.style.top = `${event.clientY - offsetY}px`;
  };

  document.addEventListener("mousemove", onMouseMove);

  document.addEventListener(
    "mouseup",
    () => {
      document.removeEventListener("mousemove", onMouseMove);
    },
    { once: true }
  );
});

function saveData() {
  if (typeof Storage === undefined) {
    return;
  }
  const parsed = JSON.stringify(bookItems);
  localStorage.setItem("bookItems", parsed);
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem("bookItems");
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookItems.push(book);
      renderElement(book);
    }
  }
}
