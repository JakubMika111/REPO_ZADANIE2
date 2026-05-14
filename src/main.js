import dayjs from 'dayjs';

const form = document.querySelector('#birthdayForm');
const dialog = document.querySelector('#resultDialog');
const content = document.querySelector('#dialogContent');
const closeBtn = document.querySelector('#closeDialog');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputDate = document.querySelector('#birthDate').value;
    const birthDate = dayjs(inputDate).startOf('day');
    const today = dayjs().startOf('day');

// 1. Obliczanie dni
    const daysSinceBirth = today.diff(birthDate, 'days');

// 2. Sprawdzenie urodzin
    if (today.format('MM-DD') === birthDate.format('MM-DD')) {
        alert("Wszystkiego najlepszego!");
    }

// 3.Ile tygodni do urodizn
    let nextBirthday = birthDate.year(today.year());
    
    if (nextBirthday.isBefore(today, 'day')) {
        nextBirthday = nextBirthday.add(1, 'year');
    }

    const weeksRemaining = nextBirthday.diff(today, 'weeks');
    let message = `Dni od Twoich narodzin: ${daysSinceBirth}`;

    if (today.format('MM-DD') !== birthDate.format('MM-DD')) {
        if (weeksRemaining === 0) {
            message += `<br>Masz urodziny w tym tygodniu!`;
        } else {
            message += `<br>Pozostało tygodni do urodzin: ${weeksRemaining}`;
        }
    }

    content.innerHTML = message;
    dialog.showModal();
});

closeBtn.addEventListener('click', () => {
    dialog.close();
});