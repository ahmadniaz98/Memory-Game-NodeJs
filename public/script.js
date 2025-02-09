document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const submitBtn = document.getElementById('submit-btn');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const imageChoicesContainer = document.getElementById('image-choices');
    const correctOrderContainer = document.getElementById('correct-order');
    const countPhotos = document.getElementById('image-count');
    const orderToggle = document.getElementById('orderToggle');
    const slider = document.getElementById("sliderhide");
    const boxes = [];
    let images = [
        'images/apple.jpg', 'images/banana.png', 'images/carrot.jpg', 'images/cat.jpg', 'images/chicken.jpg',
        'images/bear.jpg', 'images/car.jpg', 'images/helicopter.jpg', 'images/pikachu.png', 'images/truck.png',
        'images/telephone.png', 'images/mobile.jpg', 'images/sun.jpg', 'images/tv.jpg', 'images/spiderman.jpg',
        'images/football.jpg', 'images/basketball.jpg', 'images/cricket.jpg', 'images/backpack.jpg', 'images/fire.png',
        'images/computer.jpg', 'images/mcqueen.jpg', 'images/potter.jpg', 'images/trex.jpg', 'images/gorilla.jpg',
        'images/umbrella.jpg', 'images/plane.jpg', 'images/bus.jpg', 'images/baseball.jpg', 'images/boat.png',
        'images/elephant.jpg', 'images/fish.jpg', 'images/moon.jpg', 'images/notebook.jpg', 'images/octopus.jpg',
        'images/pen.jpg', 'images/tennis.jpg', 'images/turtle.png',
    ];
    let correctPositions = [];
    let selectedItems = [];
    let score = 0;
    let timeLeft = 60;
    let memorizationTimer;
    let gameTimer;
    let orderMatters = true;

    orderToggle.addEventListener('change', () => {
        orderMatters = orderToggle.checked;
    });

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function initializeGame() {
        countPhotos.style.display = 'none';
        const numImages = parseInt(countPhotos.value);
        const numOptions = numImages * 2;
        clearInterval(memorizationTimer);
        clearInterval(gameTimer);

        slider.style.display = 'none';

        correctPositions = shuffleArray([...images].slice(0,numImages));
        selectedItems = new Array(numImages).fill(null);
        timerDisplay.textContent = '01:00';
        correctOrderContainer.style.display = 'none';
        correctOrderContainer.innerHTML = '';

        gameBoard.innerHTML = '';
        imageChoicesContainer.innerHTML = '';

        for (let i = 0; i < numImages; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.dataset.index = i;
            box.style.backgroundImage = `url(${correctPositions[i]})`;
            box.style.backgroundSize = 'cover';
            gameBoard.appendChild(box);
            boxes.push(box);
        }

        const remainingImages = images.filter(image => !correctPositions.includes(image));
        const randomAdditionalImages = shuffleArray([...remainingImages]).slice(0, numImages);
        const allOptions = [...correctPositions, ...randomAdditionalImages];

        const shuffledOptions = shuffleArray(allOptions);
        shuffledOptions.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image;
            img.classList.add('image-choice');
            img.dataset.index = index;
            img.dataset.used = 'false';
            img.addEventListener('click', () => selectImage(image));
            imageChoicesContainer.appendChild(img);
        });

        startMemorizationTimer();
    }

    function startMemorizationTimer() {
        timeLeft = 5;
        timerDisplay.style.display = 'block';
        timerDisplay.textContent = '01:00';
        imageChoicesContainer.style.display = 'none';
        submitBtn.style.display = 'none';
        newGameBtn.style.display = 'none';
        restartGameBtn.style.display = 'inline-block';
        memorizationTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(memorizationTimer);
                startGame();
            } else {
                timerDisplay.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
            }
        }, 1000);
    }

    function startGame() {
        boxes.forEach(box => {
            box.style.backgroundImage = 'none';
            box.textContent = '?';
            box.classList.add('empty');
            box.addEventListener('click', () => clearBox(box));
        });

        imageChoicesContainer.style.display = 'flex';
        submitBtn.style.display = 'inline-block';

        timeLeft = 60;
        timerDisplay.textContent = '01:00';
        gameTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                timerDisplay.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
                clearInterval(gameTimer);
                submitAnswers();
            } else {
                timerDisplay.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
            }
        }, 1000);

        submitBtn.disabled = false;
    }

    function selectImage(image) {
        const emptyBox = boxes.find(box => box.classList.contains('empty'));
        if (emptyBox) {
            emptyBox.style.backgroundImage = `url(${image})`;
            emptyBox.textContent = '';
            emptyBox.classList.remove('empty');
            selectedItems[emptyBox.dataset.index] = image;

            const imgElement = imageChoicesContainer.querySelector(`img[src="${image}"]`);
            if (imgElement) {
                imgElement.dataset.used = 'true';
                imgElement.style.opacity = '0.5';
                imgElement.style.pointerEvents = 'none';
            }
        }
    }

    function clearBox(box) {
        if (!box.classList.contains('empty')) {
            const image = selectedItems[box.dataset.index];
            box.style.backgroundImage = 'none';
            box.textContent = '?';
            box.classList.add('empty');
            selectedItems[box.dataset.index] = null;

            const imgElement = imageChoicesContainer.querySelector(`img[src="${image}"]`);
            if (imgElement) {
                imgElement.dataset.used = 'false';
                imgElement.style.opacity = '1';
                imgElement.style.pointerEvents = 'auto';
            }
        }
    }

    function submitAnswers() {
        clearInterval(gameTimer);
        const numImages = parseInt(countPhotos.value);
        imageChoicesContainer.style.display = 'none';
        scoreDisplay.style.display = 'block';
        let correct = 0;
        if(orderMatters){
            boxes.forEach((box, index) => {
                if (selectedItems[index] === correctPositions[index]) {
                    box.classList.add('correct');
                    correct++;
                } else {
                    box.classList.add('incorrect');
                }
            });
        } else {
            const correctCopy = [...correctPositions];
            boxes.forEach((box, index) => {
                const selectedImage = selectedItems[index];
                const correctIndex = correctCopy.indexOf(selectedImage);
                if (correctIndex > -1) {
                    box.classList.add('correct');
                    correct++;
                    correctCopy.splice(correctIndex, 1);
                } else {
                    box.classList.add('incorrect');
                }
            });
        }

        score = correct;
        scoreDisplay.textContent = `Score: ${score}/${numImages}`;

        if (score > numImages/2) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        correctOrderContainer.style.display = 'block';
        correctOrderContainer.innerHTML = '<h2>Correct Order:</h2>';
        correctPositions.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.classList.add('correct-order-image');
            correctOrderContainer.appendChild(img);
        });

        submitBtn.style.display = 'none';
    }

    newGameBtn.addEventListener('click', () => {
        initializeGame();
    });

    submitBtn.addEventListener('click', submitAnswers);
});