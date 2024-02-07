let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  const toyCollection = document.querySelector('#toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });

  fetch('http://localhost:3000/toys')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.forEach((toy) => {
        createCard(toy);
      });
    });

  function createCard(toy) {
    let toyCard = document.createElement('div');
    toyCard.className = 'card';
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.append(toyCard);
    let likeButton = toyCard.querySelector('.like-btn');
    likeButton.addEventListener('click', (event) => {
      incrementLike(toyCard, toy);
    });
  }

  function addNewToy(toyName, imageUrl) {
    const newToyObj = { name: toyName, image: imageUrl, likes: 0 };
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(newToyObj),
    })
      .then((res) => res.json())
      .then((newToy) => createCard(newToy));
  }

  addToyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let toyName = document.querySelector('input[name="name"]').value;
    let imageURL = document.querySelector('input[name="image"]').value;
    addNewToy(toyName, imageURL);
  });

  function incrementLike(toyCard, toy) {
    let likeCounter = toy.likes;
    console.log(likeCounter);
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ likes: ++likeCounter }),
    })
      .then((res) => res.json())
      .then((responseValue) => {
        console.log(responseValue);
        toyCard.querySelector('p').textContent = `${likeCounter} Likes`;
      });
  }
});
