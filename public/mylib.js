function getFirstPictures(amount) {
  const req = new XMLHttpRequest();
  req.open('GET', '/api/pictures?&amount=' + amount , false);
  req.send(null);
  let json = JSON.parse(req.responseText);
  showPictures(json.pictures);
};

function getPictures(cursor, amount) {
  const req = new XMLHttpRequest();
  req.open('GET', '/api/pictures?cursor=' + cursor + "&amount=" + amount , false);
  req.send(null);
  if (req.status != 404) {
    let json = JSON.parse(req.responseText);
    showPictures(json.pictures);
  }
};

function showPictures(pictures) {
  let grid = document.querySelector('.grid');
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < pictures.length; i++) {
    let cell = document.createElement('div');
    cell.setAttribute('class', 'cell')

    // Image with attributes
    let img = document.createElement('img');
    img.setAttribute('src', pictures[i].picture);
    img.setAttribute('alt', pictures[i].caption);
    img.setAttribute('width', 200);
    img.setAttribute('height', 200);

    // Button for delete
    let btn = document.createElement('button');
    btn.innerHTML = 'X';
    btn.setAttribute('class', 'btn-delete');
    btn.onclick = function() {
      const req = new XMLHttpRequest();
      cell.parentNode.removeChild(cell);
      req.open('DELETE', '/api/pictures/' + pictures[i].id, false);
      req.send(null);
    };

    // Construct DOM
    cell.appendChild(img);
    cell.appendChild(btn);
    fragment.appendChild(cell);
  }

  grid.appendChild(fragment);
};

/*function sendPicture() {
  var data = {
    'picture' : document.getElementById('picture').value,
    'caption' : document.getElementById('caption').value
  }
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/api/pictures", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xmlhttp.send(JSON.stringify(data));
};*/
