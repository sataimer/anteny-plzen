(function () {
  "use strict";

  const MAX_QUESTION = 540;
  const form = document.querySelector("[data-question-search]");
  const input = document.querySelector("[data-question-number]");

  function goToQuestion(value) {
    const number = Number.parseInt(String(value), 10);
    if (!Number.isInteger(number) || number < 1 || number > MAX_QUESTION) {
      input.setCustomValidity(`Zadejte číslo otázky 1 až ${MAX_QUESTION}.`);
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    window.location.href = `${number}.html`;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    goToQuestion(input.value);
  });

  const holder = document.querySelector("[data-question]");
  if (!holder) return;

  const match = window.location.pathname.match(/\/(\d+)\.html$/);
  const number = match ? Number.parseInt(match[1], 10) : null;
  if (!number) return;

  fetch("questions.json")
    .then((response) => {
      if (!response.ok) throw new Error("Data otázek nejsou dostupná.");
      return response.json();
    })
    .then((questions) => {
      const question = questions[String(number)];
      if (!question) throw new Error(`Otázka ${number} zatím není zpracovaná.`);
      renderQuestion(number, question);
    })
    .catch((error) => {
      holder.innerHTML = `<h1>Otázka ${number}</h1><p class="status"></p>`;
      holder.querySelector(".status").textContent = error.message;
    });

  function renderQuestion(questionNumber, question) {
    document.title = `Otázka ${questionNumber} – Testy elektrikář`;
    document.querySelector("[data-title]").textContent = `Otázka ${questionNumber}`;
    document.querySelector("[data-text]").textContent = question.text;

    const answers = document.querySelector("[data-answers]");
    answers.replaceChildren();
    question.answers.forEach((answer, index) => {
      const item = document.createElement("li");
      item.textContent = answer;
      if (question.correct.includes(index)) item.className = "correct";
      answers.appendChild(item);
    });

    document.querySelector("[data-correct]").textContent = question.correct
      .map((index) => `${String.fromCharCode(97 + index)}) ${question.answers[index]}`)
      .join("; ");
    document.querySelector("[data-explanation]").textContent = question.explanation;

    const note = document.querySelector("[data-source-note]");
    if (question.sourceNote) {
      note.textContent = `Poznámka k rozporu: ${question.sourceNote}`;
      note.classList.remove("hidden");
    } else {
      note.classList.add("hidden");
    }

    const image = document.querySelector("[data-image]");
    if (question.image) {
      image.src = question.image;
      image.alt = question.imageAlt || `Schéma k otázce ${questionNumber}`;
      image.classList.remove("hidden");
    }

    const previous = document.querySelector("[data-previous]");
    const next = document.querySelector("[data-next]");
    previous.href = `${Math.max(1, questionNumber - 1)}.html`;
    next.href = `${Math.min(MAX_QUESTION, questionNumber + 1)}.html`;
    previous.classList.toggle("hidden", questionNumber === 1);
    next.classList.toggle("hidden", questionNumber === MAX_QUESTION);
  }
})();
