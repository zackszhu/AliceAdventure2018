let state = 1;

function goBack() {
  const states = [document.getElementById('step_1'), document.getElementById('step_2'), document.getElementById('step_3'), document.getElementById('step_4')];
  if (state > 1 && state < 5) { // Maybe not needed
    states[state - 1].style.display = 'none';
    state -= 1;
    states[state - 1].style.display = 'block';
  }
  // const state1 = document.getElementById('step_1');
  // const state2 = document.getElementById('step_2');
  // const state3 = document.getElementById('step_3');
  // const state4 = document.getElementById('step_4');
  // switch (state) {
  //   case 2:
  //     state = 1;
  //     state1.style.display = 'block';
  //     state2.style.display = 'none';
  //     break;
  //   case 3:
  //     state = 2;
  //     state2.style.display = 'block';
  //     state3.style.display = 'none';
  //     break;
  //   case 4:
  //     state = 3;
  //     state3.style.display = 'block';
  //     state4.style.display = 'none';
  //     break;
  //   default:
  //     break;
  // }
}

function goToNext() {
  const states = [document.getElementById('step_1'), document.getElementById('step_2'), document.getElementById('step_3'), document.getElementById('step_4')];
  if (state > 0 && state < 4) {
    states[state - 1].style.display = 'none';
    state += 1;
    states[state - 1].style.display = 'block';
  }
  else if (state === 4) {
    state = 5;
  }
  // const state1 = document.getElementById('step_1');
  // const state2 = document.getElementById('step_2');
  // const state3 = document.getElementById('step_3');
  // const state4 = document.getElementById('step_4');
  // switch (state) {
  //   case 1:
  //     state = 2;
  //     state1.style.display = 'none';
  //     state2.style.display = 'block';

  //     break;
  //   case 2:
  //     state = 3;
  //     state2.style.display = 'none';
  //     state3.style.display = 'block';
  //     break;
  //   case 3:
  //     state = 4;
  //     state3.style.display = 'none';
  //     state4.style.display = 'block';
  //     break;
  //   case 4:
  //     state = 5;
  //     break;
  //   default:
  //     break;
  // }
}

function goSkip() {
  state = 5;
}
