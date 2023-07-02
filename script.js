document.addEventListener('DOMContentLoaded', function() {

    
let currentMovieIndex = 0;

//Display Movie Details
function getMovieDetails(movieId) {
    return fetch(`http://localhost:3000/films/${movieId}`)
    .then (response => response.json())
    .then (data => {

        
        const movieDetailsContainer = document.getElementById('movie-details');
        movieDetailsContainer.innerHTML = `
          
          <div class="movieCard">
          
          <h2>${data.title}</h2> 
          <img src="${data.poster}" alt="Movie Poster" />
          <p>Runtime: ${data.runtime} minutes</p>
          <p>Showtime: ${data.showtime}</p>
          <p class="tickets-available">Available Tickets: ${data.capacity - data.tickets_sold}</p>   
          <button type="button" class="buy-ticket">Buy Ticket</button>
          <div>
        `;

        const  button = document.querySelector('.buy-ticket');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            buyTicket(movieId);
        });
    })  

    .catch(error => {
        console.error('Error:', error)
    });
}


//Display Movie List
function getAllMovies() {
    return fetch('http://localhost:3000/films')
    .then (response => response.json())
    .then (data => {
        const movieList = document.getElementById('films');
        data.forEach(movie => {
            const li = document.createElement('li');
            li.classList.add('film')
            li.textContent = movie.title;
            li.addEventListener('click', () => {
                getMovieDetails(movie.id)
            });
            //movieList.appendChild(li)
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
              deleteMovie(movie.id, li);
            });
    
            li.appendChild(deleteButton);
            movieList.appendChild(li);
            });


            //Show next movie details after previous has been deleted
            currentMovieIndex = 0; // Reset the current movie index
            if (data.length > 0) {
            const firstMovie = data[0];
            getMovieDetails(firstMovie.id);
      }
        })

    .catch(error => {
        console.error('Error:',  error);
    });
    }


  //Buy Tickets
  function buyTicket(movieId) {
    
    fetch(`http://localhost:3000/films/${movieId}`)
    .then (response => response.json())
    .then(data => {
        const ticketsAvailable = data.capacity - data.tickets_sold;
        if (ticketsAvailable >=1) {  //update after tickets sold
            
            const movieDetailsContainer = document.getElementById('movie-details');
            const ticketsAvailableElement = movieDetailsContainer.querySelector('.tickets-available');

            const updatedTicketsAvailable = ticketsAvailable - 1;
            ticketsAvailableElement.textContent = `Available Tickets: ${updatedTicketsAvailable}`;

            //update(patch) number of tickets sold
                fetch(`http://localhost:3000/films/${movieId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify( {
                        tickets_sold: data.tickets_sold + 1
                    })
                })

                .then(response => response.json())
                .then(data => { console.log(data) }) //changes updated
                .catch(error => {
                    console.error('Error:', error);
                  });

        } else {
            
            const button = document.querySelector('.buy-ticket');
            button.textContent = 'Sold Out';
            button.disabled = true;

            const filmItem = document.querySelector(`li[data-movie-id="${movieId}"]`);
            filmItem.classList.add('sold-out');
        
        }

    })
    
    
  }

  //Delete Movies
  function deleteMovie(movieId, listItem) {
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        listItem.remove();
        console.log('Film deleted successfully');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


getAllMovies()



})























