
        const characters = {
            easy: [
                { name: 'Ruby\nRose', class: 'ruby', icon: '🌹' },
                { name: 'Weiss\nSchnee', class: 'weiss', icon: '❄️' },
                { name: 'Blake\nBelladonna', class: 'blake', icon: '🐱' },
                { name: 'Yang\nXiao Long', class: 'yang', icon: '🔥' }
            ],
            medium: [
                { name: 'Ruby\nRose', class: 'ruby', icon: '🌹' },
                { name: 'Weiss\nSchnee', class: 'weiss', icon: '❄️' },
                { name: 'Blake\nBelladonna', class: 'blake', icon: '🐱' },
                { name: 'Yang\nXiao Long', class: 'yang', icon: '🔥' },
                { name: 'Jaune\nArc', class: 'jaune', icon: '⚔️' },
                { name: 'Pyrrha\nNikos', class: 'pyrrha', icon: '🛡️' }
            ],
            hard: [
                { name: 'Ruby\nRose', class: 'ruby', icon: '🌹' },
                { name: 'Weiss\nSchnee', class: 'weiss', icon: '❄️' },
                { name: 'Blake\nBelladonna', class: 'blake', icon: '🐱' },
                { name: 'Yang\nXiao Long', class: 'yang', icon: '🔥' },
                { name: 'Jaune\nArc', class: 'jaune', icon: '⚔️' },
                { name: 'Pyrrha\nNikos', class: 'pyrrha', icon: '🛡️' },
                { name: 'Cinder\nFall', class: 'cinder', icon: '🔥' },
                { name: 'Roman\nTorchwick', class: 'roman', icon: '🎩' }
            ]
        };

        let currentDifficulty = 'easy';
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let timer = 0;
        let timerInterval = null;
        let canFlip = true;

        function setDifficulty(difficulty) {
            currentDifficulty = difficulty;
            
            // Update button styles
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update board class
            const board = document.getElementById('gameBoard');
            board.className = `game-board ${difficulty}`;
            
            resetGame();
        }

        function initGame() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';
            
            // Create card pairs
            const selectedChars = characters[currentDifficulty];
            cards = [...selectedChars, ...selectedChars];
            
            // Shuffle cards
            cards.sort(() => Math.random() - 0.5);
            
            // Create card elements
            cards.forEach((char, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.character = char.name;
                
                card.innerHTML = `
                    <div class="card-front">❓</div>
                    <div class="card-back ${char.class}">
                        <div>${char.icon}<br>${char.name}</div>
                    </div>
                `;
                
                card.addEventListener('click', flipCard);
                board.appendChild(card);
            });
            
            // Update pairs display
            document.getElementById('pairs').textContent = `0/${selectedChars.length}`;
            
            // Start timer
            startTimer();
        }

        function flipCard() {
            if (!canFlip) return;
            if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
            if (flippedCards.length >= 2) return;
            
            this.classList.add('flipped');
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                moves++;
                document.getElementById('moves').textContent = moves;
                checkMatch();
            }
        }

        function checkMatch() {
            canFlip = false;
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.character === card2.dataset.character) {
                // Match found
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    
                    const totalPairs = characters[currentDifficulty].length;
                    document.getElementById('pairs').textContent = `${matchedPairs}/${totalPairs}`;
                    
                    flippedCards = [];
                    canFlip = true;
                    
                    if (matchedPairs === totalPairs) {
                        endGame();
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timer = 0;
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
                timer++;
                updateTimerDisplay();
            }, 1000);
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            document.getElementById('timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        function endGame() {
            clearInterval(timerInterval);
            
            document.getElementById('finalMoves').textContent = moves;
            document.getElementById('finalTime').textContent = 
                document.getElementById('timer').textContent;
            
            setTimeout(() => {
                document.getElementById('winModal').classList.add('active');
            }, 500);
        }

        function closeModal() {
            document.getElementById('winModal').classList.remove('active');
            resetGame();
        }

        function resetGame() {
            clearInterval(timerInterval);
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            timer = 0;
            canFlip = true;
            
            document.getElementById('moves').textContent = '0';
            document.getElementById('timer').textContent = '0:00';
            
            initGame();
        }

        // Initialize game on load
        window.onload = () => {
            initGame();
        };