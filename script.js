let playersData = [];

fetch('top_50_football_players_2025.json')
    .then(response => response.json()).then(data1 => {
        fetch('club_national_team_images.json')
            .then(response => response.json())
            .then(data2 => {
                playersData = [...data1];
                const clubs = data2;
                let mainPlayer = getRandomPlayer();

                const cards = document.querySelectorAll('.cardsHolder div img');

                const clubEntries = clubs.map(club => {
                    const key = Object.keys(club)[0];
                    return {
                        name: key,
                        imageUrl: club[key]
                    };
                });

                const shuffledClubs = [...clubEntries].sort(() => 0.5 - Math.random());

                cards.forEach((card, index) => {
                    if (shuffledClubs[index]) {
                        card.src = shuffledClubs[index].imageUrl;
                        card.alt = shuffledClubs[index].name;
                        card.parentElement.setAttribute('club-name', shuffledClubs[index].name);
                    }
                });

                function getRandomPlayer() {
                    if (playersData.length === 0) {
                        alert('All players have been used! Resetting...');
                        window.location.reload();
                        return;
                    }

                    const randomPlayerIndex = Math.floor(Math.random() * playersData.length);
                    const player = playersData[randomPlayerIndex];
                    playersData.splice(randomPlayerIndex, 1);

                    const playerNameElement = document.querySelector('.playerName');
                    const playerImgElement = document.querySelector('.playerImgg');
                    playerNameElement.innerHTML = player.name;
                    playerImgElement.src = player.image;
                    playerNameElement.classList.add('changed');
                    setTimeout(() => playerNameElement.classList.remove('changed'), 500);

                    console.log(player);
                    return player;
                }

                document.querySelector('.rollBtn').addEventListener('click', () => {
                    mainPlayer = getRandomPlayer();
                });

                let correctCards = 0;
                let errorCount = 15;
                let errorInt = setInterval(() => {
                    if (errorCount > 0) {
                        document.querySelector('.errorDiv h3 span').innerHTML = errorCount;
                    } else {
                        document.querySelector('.endGame h1').innerHTML = "Game Over!";
                        document.querySelector('.endGame h2').innerHTML = "You have made too many errors.";
                        document.querySelector('.endGame').style.top="50%";
                        rematchBtn.addEventListener("click", () => {
                            window.location.reload();
                        });
                        clearInterval(errorInt);
                    }
                }, 100);
                let rematchBtn = document.querySelector('.rematchBtn');
                cards.forEach(card => {
                    card.parentElement.addEventListener('click', () => {
                        const clubName = card.parentElement.getAttribute('club-name');
                        if (mainPlayer.clubs.includes(clubName)) {
                            if (!card.parentElement.classList.contains('correct')) {
                                const playerImgElement = document.querySelector('.playerImgg');
                                let newImg = document.createElement('img');
                                newImg.src = playerImgElement.src;
                                newImg.classList.add('newPlayerImg');
                                newImg.style.cssText="width:90px;height:120px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.7;";
                                card.parentElement.appendChild(newImg);
                                card.parentElement.classList.add('correct');
                                mainPlayer = getRandomPlayer();
                                card.classList.add('correctCard');
                                card.parentElement.style.pointerEvents = 'none';
                                correctCards++;
                                if (correctCards === cards.length) {
                                    document.querySelector('.endGame h1').innerHTML = "Congratulations !";
                                    document.querySelector('.endGame h2').innerHTML = `You have completed the game with <span class="text-danger">${15-errorCount}</span> mistakes`;
                                    setTimeout(() => {
                                        document.querySelector('.endGame').style.top="50%";
                                    }, 1000);
                                }
                                rematchBtn.addEventListener("click", () => {
                                window.location.reload();
                                });
                            }
                        } else {
                            card.parentElement.style.borderColor = 'red';
                            errorCount--;
                            setTimeout(() => {
                                card.parentElement.style.borderColor = 'white';
                            }, 200);
                        }
                        
                        
                    });
                });

            })
            .catch(error => console.error('Error fetching player data:', error));
    })
    .catch(error => console.error('Error fetching player data:', error));
