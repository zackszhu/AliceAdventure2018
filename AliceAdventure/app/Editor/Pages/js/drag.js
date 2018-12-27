const interact = require('interactjs');

function dragMoveListener(event) {
  const { target } = event;
  // keep the dragged position in the data-x/data-y attributes

  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;


  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


  // translate the element
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.style.webkitTransform = target.style.transform;

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);

  event.stopImmediatePropagation();
}

interact('.interaction-box')
  .draggable({
    // enable inertial throwing
    inertia: true,
    snap: {
      targets: [
        interact.createSnapGrid({
          x: 30,
          y: 30,
        }),
      ],
      range: Infinity,
      relativePoints: [{
        x: 0,
        y: 0,
      }],
    },

    onmove: dragMoveListener,
    // keep the element within the area of it's parent
    restrict: {
      restriction: 'parent',

      // endOnly: true,
      elementRect: {
        top: 0,
        left: 0,
        bottom: 1,
        right: 1,
      },
    },
    // enable autoScroll
    autoScroll: false,

  });


interact('.interaction-box').ignoreFrom('li');

function minimizeWindow(event) {
  const eventTarget = event.target.parentNode;
  const targetImg = event.target.closest('#interaction-box-minimize');
  const target = eventTarget.closest('.interaction-box');
  const targetChildren = target.childNodes;
  const minimizeSrc = document.getElementById('interaction-box-minimize').getAttribute('min-src');
  const maxmizeSrc = document.getElementById('interaction-box-minimize').getAttribute('max-src');
  window.console.log(minimizeSrc);
  window.console.log(maxmizeSrc);
  if (target.getAttribute('max') !== null) {
    const isMax = target.getAttribute('max') === true;
    targetImg.src = isMax ? maxmizeSrc : minimizeSrc;
    target.style.width = isMax ? '250px' : null;
    for (let i = 0; i < targetChildren.length; i += 1) {
      if (targetChildren[i].tagName === 'UL' || targetChildren[i].tagName === 'H6') {
        targetChildren[i].style.display = isMax ? 'none' : 'block';
      }
    }
  }
}

// this is used later in the resizing and gesture demos
// window.dragMoveListener = dragMoveListener;
