function switchGalleryView() {
  const gallery = document.getElementById('gallery');
  const objectList = document.getElementById('object-list');

  if (gallery.style.display === 'none' || objectList.style.display === 'block') {
    gallery.style.display = 'block';
    objectList.style.display = 'none';
  }
}

function switchListView() {
  const gallery = document.getElementById('gallery');
  const objectList = document.getElementById('object-list');

  if (objectList.style.display === 'none' || gallery.style.display === 'block') {
    objectList.style.display = 'block';
    gallery.style.display = 'none';
  }
}

function switchCategoryView() {
  /* if (document.addEventListener){}else if (document.attachEvent) {  }
   */

  document.addEventListener('click', (event) => {
    const { target } = event;
    const previousSelected = document.getElementsByClassName('selected');
    const assetName = target.getAttribute('aria-controls');
    if (target.className === 'unselecteds') {
      window.console.log('yes');
      for (let i = 0; i < previousSelected.length; i += 1) {
        previousSelected[i].setAttribute('class', 'unselecteds');
      }
      target.className = 'selected';
      document.getElementById(assetName).style.display = 'block';
      const unselecteds = document.getElementsByClassName('unselecteds');
      if (unselecteds.length !== null) {
        for (let j = 0; j < unselecteds.length; j += 1) {
          const assetNameUnselected = unselecteds[j].getAttribute('aria-controls');
          document.getElementById(assetNameUnselected).style.display = 'none';
        }
      }
    }
  });
}
