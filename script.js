const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.lang = "en-US";

let fullText = "";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const saveBtn = document.getElementById("saveBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const textBox = document.getElementById("textBox");
const notesList = document.getElementById("notesList");

let savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
savedNotes.forEach(addNoteToList);

startBtn.addEventListener("click", () => {
  fullText = "";
  textBox.value = "";
  recognition.start();
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
});

recognition.onresult = event => {
  const spoken = event.results[0][0].transcript;
  textBox.value = spoken;

  if (event.results[0].isFinal) {
    fullText += spoken + " ";
    textBox.value = fullText;
  }
};

saveBtn.addEventListener("click", () => {
  const noteText = textBox.value.trim();
  if (noteText === "") return;

  addNoteToList(noteText);
  savedNotes.push(noteText);

  localStorage.setItem("notes", JSON.stringify(savedNotes));
  textBox.value = "";
});

clearAllBtn.addEventListener("click", () => {
  notesList.innerHTML = "";
  savedNotes = [];
  localStorage.setItem("notes", JSON.stringify(savedNotes));
});

function addNoteToList(text) {
  const li = document.createElement("li");
  li.className = "note";

  const span = document.createElement("div");
  span.className = "text";
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    notesList.removeChild(li);
    savedNotes = savedNotes.filter(item => item !== text);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  notesList.appendChild(li);
}
