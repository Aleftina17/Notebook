const addBtn = document.getElementById("add-btn");
const addTitle = document.getElementById("note-title");
const addText = document.getElementById("note-text");
const fileInput = document.getElementById("note-image");
const notesElm = document.getElementById("notes");

// ADD NOTE
addBtn.addEventListener("click", () => {
  if (addTitle.value === "" || addText.value === "") {
    return alert("Please add note title and text");
  }

  let notesObj = JSON.parse(localStorage.getItem("notes") || "[]");

  // Get the current date and time
  const currentDate = new Date();
  const dateTime = currentDate.toLocaleString();

  // Convert the image file to a Base64-encoded string and store it in local storage
  let imageSrc = "";
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageSrc = e.target.result;

      // Add the note to the notes object and store it in local storage
      notesObj.push({
        title: addTitle.value,
        text: addText.value,
        image: imageSrc,
        date: dateTime,
      });

      localStorage.setItem("notes", JSON.stringify(notesObj));

      // Clear the input fields
      addTitle.value = "";
      addText.value = "";
      fileInput.value = "";

      // Update the notes list
      showNotes();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    // Add the note to the notes object and store it in local storage
    notesObj.push({
      title: addTitle.value,
      text: addText.value,
      image: imageSrc,
      date: dateTime,
    });

    localStorage.setItem("notes", JSON.stringify(notesObj));

    // Clear the input fields
    addTitle.value = "";
    addText.value = "";

    // Update the notes list
    showNotes();
  }
});

// SHOW NOTES
function showNotes() {
  const notesObj = JSON.parse(localStorage.getItem("notes") || "[]");

  let html = "";

  notesObj.forEach(({ title, text, image, date }, index) => {
    html += `
      <div class="note">
      <div class="note__header">
        <h3 class="note__title">${title}</h3>
        <button class="note__btn btn-close" onclick="closeNote()"><div class="btn-close-icon"></div></button>
        <p class="note__counter"><span class="note__counter-word">Note</span> ${
          index + 1
        }</p>
        </div>
        <div class="note__body">
          <p class="note__text">${text}</p>
          ${image ? `<img class="note__img" src="${image}" alt="" />` : ""}
          <p class="note__date">${date}</p>
          </div>
        <div class="note__footer">
          <button id="${index}" onclick="deleteNote(${index})" class="note__btn">Delete Note</button>
          <button id="${index}" onclick="editNote(${index})" class="note__btn edit-btn">Edit Note</button>
        </div>
      </div>
    `;
  });

  if (notesObj.length === 0) {
    html = "No Notes Yet! Add a note using the form";
  }

  notesElm.innerHTML = html;
}

//DELETE NOTE

function deleteNote(index) {
  const confirmDel = confirm("Delete this note?");

  body.classList.remove("blurred-bg");

  if (confirmDel) {
    const notesObj = JSON.parse(localStorage.getItem("notes") || "[]");
    notesObj.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
  }
}

//EDIT NOTE

function editNote(index) {
  const notesObj = JSON.parse(localStorage.getItem("notes") || "[]");
  const { title, text } = notesObj[index];

  body.classList.remove("blurred-bg");

  if (addTitle.value !== "" || addText.value !== "" || fileInput.value !== "") {
    return alert("Please clear the form before editing the note");
  }

  addTitle.value = title;
  addText.value = text;

  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}

showNotes();

//NOTES ACCORDION

const noteTitle = document.querySelectorAll(".note__title");

noteTitle.forEach((noteTitle) => {
  noteTitle.onclick = function () {
    const noteBody = this.closest(".note").querySelector(".note__body");
    noteBody.classList.toggle("hidden");
    noteTitle.classList.toggle("clicked");
  };
});

//DELETE FILE BTN AND ADD FILE INDICATOR

const fileLabel = document.getElementById("input__file-btn");
// const fileIndicator = document.getElementById("file-indicator");
const deleteBtn = document.querySelector(".delete-btn");
const deleteIcon = document.querySelector(".delete-icon");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    deleteBtn.classList.remove("hidden");
    // fileIndicator.classList.remove('hidden');
  } else {
    deleteBtn.classList.add("hidden");
    // fileIndicator.classList.add('hidden');
  }
});

deleteBtn.addEventListener("click", (event) => {
  event.preventDefault();
  fileInput.value = "";
  deleteBtn.classList.add("hidden");
});

//OPEN FULL NOTE

const noteText = document.querySelectorAll(".note__text");
const noteImg = document.querySelectorAll(".note__img");
const body = document.querySelector("body");

noteText.forEach((text) => {
  text.addEventListener("click", () => {
    const note = text.parentNode.parentNode;
    const noteCounter = note.querySelector(".note__counter");

    body.classList.add("blurred-bg");
    note.classList.add("open-full");
    noteCounter.classList.add("hidden-dn");
  });
});

noteImg.forEach((img) => {
  img.addEventListener("click", () => {
    const note = img.parentNode.parentNode;
    const noteCounter = note.querySelector(".note__counter");

    body.classList.add("blurred-bg");
    note.classList.add("open-full");
    noteCounter.classList.add("hidden-dn");
  });
});

function closeNote() {
  const note = document.querySelector(".note.open-full");
  note.classList.remove("open-full");
  body.classList.remove("blurred-bg");

  const noteCounter = note.querySelector(".note__counter");
  noteCounter.classList.remove("hidden-dn");
}
