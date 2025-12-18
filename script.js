const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvzXdmDtpj0nSU5DxcOpiKGuJNlWqEoCuqk6NcUFNXN9BjSqUG7afMZw-6BuizkGHM/exec';

const quizData = [
    { questionNumber: 1, question: "Apabila terjadi kebakaran di Gudang, apa hal pertama yang harus dilakukan?", options: ["menyelamatkan material", "berlari", "pencet tombol emergency", "mengambil apar"], correctAnswer: "pencet tombol emergency", rationale: "Mengaktifkan alarm adalah prioritas untuk evakuasi." },
    { questionNumber: 2, question: "Lalu setelah tombol dinyalakan maka, apa yang harus dilakukan?", options: ["berlari dan tidak berkerumun", "membantu teman yang memegang apar", "mengambil air", "berteriak api/kebakaran"], correctAnswer: "berteriak api/kebakaran", rationale: "Memberi peringatan suara agar rekan lain waspada." },
    { questionNumber: 3, question: "Setelah mendengar bunyi emergency maka hendaknya saudara lari ke...", options: ["flexo", "gudang 8", "depan pantry", "depan gudang"], correctAnswer: "depan pantry", rationale: "Area ini merupakan Assembly Point resmi." },
    { questionNumber: 4, question: "Siapa yang boleh mengambil apar dan memadamkan api?", options: ["Yang menyebabkan api", "PIC Gudang/security", "siapa saja", "Mas Rhoma"], correctAnswer: "PIC Gudang/security", rationale: "PIC dan Security telah terlatih menggunakan alat pemadam." },
    { questionNumber: 5, question: "Apa yang harus dilakukan jika terjebak asap di dalam gudang?", options: ["Wassalam", "merangkak menghindari asap", "berteriak minta tolong", "diam menunggu"], correctAnswer: "merangkak menghindari asap", rationale: "Udara bersih biasanya berada di bawah lapisan asap." },
    { questionNumber: 6, question: "Sebutkan salah satu hal di gudang yang dapat menyebabkan kebakaran?", answerType: "text", correctAnswer: "korsleting listrik, merokok, korek, mesin panas", rationale: "Kelalaian dan faktor teknis bisa memicu api." },
    { questionNumber: 7, question: "Diletakkan dimana saja APAR biasanya?", answerType: "text", correctAnswer: "dekat pintu masuk, jalur evakuasi", rationale: "Agar mudah dijangkau saat terjadi keadaan darurat." },
    { questionNumber: 8, question: "Bagaimana cara memakai APAR?", options: ["tarik pin pengaman dan arahkan selang ke pangkal api", "ditekan tuasnya", "dilemparkan seperti granat", "Tanya Mas Daffa"], correctAnswer: "tarik pin pengaman dan arahkan selang ke pangkal api", rationale: "Ini adalah prosedur standar PASS (Pull, Aim, Squeeze, Sweep)." },
    { questionNumber: 9, question: "Apa warna APAR?", options: ["merah", "putih", "kuning", "Tanya Mas Daffa"], correctAnswer: "merah", rationale: "Warna standar internasional untuk APAR adalah merah." },
    { questionNumber: 10, question: "Apa zat yang ada di dalam APAR?", options: ["Air panas", "Air biasa", "Asap", "CO2/Foam"], correctAnswer: "CO2/Foam", rationale: "Media ini efektif memutus rantai reaksi kimia api." }
];

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

function startQuiz() {
    const nameInput = document.getElementById('user-name').value;
    if (nameInput.trim() === "") {
        alert("Silakan masukkan nama dan departemen Anda!");
        return;
    }
    userName = nameInput;
    document.getElementById('name-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const current = quizData[currentQuestionIndex];
    const quizScreen = document.getElementById('quiz-screen');
    let content = '';

    if (current.answerType === "text") {
        content = `
            <div class="question-box">
                <div class="question-text">Soal ${current.questionNumber}/${quizData.length}: ${current.question}</div>
                <input type="text" id="text-input" class="input-answer" placeholder="Ketik jawaban di sini...">
                <button class="next-button" id="submit-btn" onclick="checkTextAnswer()">KIRIM JAWABAN</button>
                <div id="feedback" class="rationale" style="display:none;"></div>
            </div>
        `;
    } else {
        const optionsHtml = current.options.map(opt => `<button class="option-button" onclick="checkChoiceAnswer(this, '${opt}')">${opt}</button>`).join('');
        content = `
            <div class="question-box">
                <div class="question-text">Soal ${current.questionNumber}/${quizData.length}: ${current.question}</div>
                <div>${optionsHtml}</div>
                <div id="feedback" class="rationale" style="display:none;"></div>
            </div>
        `;
    }
    quizScreen.innerHTML = content;
}

function checkChoiceAnswer(btn, selected) {
    const current = quizData[currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    document.querySelectorAll('.option-button').forEach(b => b.disabled = true);

    if (selected === current.correctAnswer) {
        btn.classList.add('correct');
        score++;
        feedback.innerHTML = `✅ <b>BENAR!</b><br>${current.rationale}`;
    } else {
        btn.classList.add('incorrect');
        feedback.innerHTML = `❌ <b>SALAH!</b><br>Jawaban benar: <b>${current.correctAnswer}</b>`;
    }
    feedback.style.display = 'block';
    addNextButton();
}

function checkTextAnswer() {
    const current = quizData[currentQuestionIndex];
    const input = document.getElementById('text-input');
    const userVal = input.value.toLowerCase().trim();
    const feedback = document.getElementById('feedback');
    
    if (userVal === "") return;

    const validAnswers = current.correctAnswer.split(',').map(a => a.trim().toLowerCase());
    const isCorrect = validAnswers.some(ans => userVal.includes(ans));

    input.disabled = true;
    document.getElementById('submit-btn').style.display = 'none';

    if (isCorrect) {
        score++;
        input.style.borderColor = "#4CAF50";
        input.style.backgroundColor = "#1b4332";
        feedback.innerHTML = `✅ <b>BENAR!</b><br>${current.rationale}`;
    } else {
        input.style.borderColor = "#f44336";
        input.style.backgroundColor = "#4d1616";
        feedback.innerHTML = `❌ <b>KURANG TEPAT</b><br>Jawaban benar: <b>${current.correctAnswer}</b>`;
    }
    feedback.style.display = 'block';
    addNextButton();
}

function addNextButton() {
    const btn = document.createElement('button');
    btn.className = 'next-button';
    btn.textContent = (currentQuestionIndex < quizData.length - 1) ? 'PERTANYAAN BERIKUTNYA' : 'LIHAT HASIL AKHIR';
    btn.onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) loadQuestion();
        else showResult();
    };
    document.getElementById('quiz-screen').appendChild(btn);
}

function showResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('score-text').innerHTML = `Halo <b>${userName}</b>,<br>Skor Anda: <span style="color:#ffcc00; font-size:1.5em;">${score} / ${quizData.length}</span>`;
    sendDataToSheet();
}

function sendDataToSheet() {
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
            nama: userName,
            skor: score + "/" + quizData.length,
            waktu: new Date().toLocaleString('id-ID')
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(() => {
        document.getElementById('saving-text').innerHTML = "✅ Skor otomatis tersimpan di Database.";
        document.getElementById('saving-text').style.color = "#4CAF50";
    }).catch(() => {
        document.getElementById('saving-text').innerHTML = "❌ Koneksi Gagal. Skor tidak tersimpan.";
        document.getElementById('saving-text').style.color = "#f44336";
    });
}// JavaScript Document