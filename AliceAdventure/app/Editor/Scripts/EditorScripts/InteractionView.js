const {
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Interaction = require('./Interaction');
const View = require('./View');

class InteractionView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('InteractionView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementId) {
    return new InteractionView(elementId);
  }

  InitView() {
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        viewEnabled: false,
        interactions: null,
        objects: null,
        states: null,
        scenes: null,
        sounds: null,
        isDraggingReact: false,
      },
      methods: {
        initBox: (ntra, el) => {
          window.console.log(el);
          // InteractionView.prototype.initBox(ntra, el)
        },

        resizeClick: (ev, ntra) => {
          InteractionView.MinimizeWindow(ev, ntra);
        },
        editTitle: (ev, ntra) => {
          InteractionView.EditInPlace(ev, ntra);
        },
        eventDragover: (ev) => {
          super.HandleDragover(ev, View.Draginfo.IEvent);
        },
        eventDrop: (ev, ntra) => {
          super.HandleDrop(ev, View.Draginfo.IEvent, (data) => {
            ntra.SetIEvent(data);
          });
        },
        stateDragover: (ev) => {
          super.HandleDragover(ev, View.Draginfo.State);
        },
        stateDrop: (ev, ntra) => {
          super.HandleDrop(ev, View.Draginfo.State, (data) => {
            ntra.AddCondition(data);
          });
        },
        reactionDragover: (ev) => {
          super.HandleDragover(ev, View.Draginfo.IReaction);
        },
        reactionDrop: (ev, ntra) => {
          super.HandleDrop(ev, View.Draginfo.IReaction, (data) => {
            ntra.AddIReaction(data);
          });
        },
        addInteraction: () => {
          this.AddNewInteraction();
        },
        deleteInteraction: (ntra) => {
          ntra.DeleteThis();
        },
        removeCondition: (state, ntra) => {
          ntra.RemoveCondition(state);
        },
        deleteReaction: (react, ntra) => {
          ntra.DeleteIReaction(react);
        },

        // order:
        reactDragStart: (ev, d) => {
          super.HandleDragstart(ev, View.Draginfo.ListedIReaction, d);
          ev.stopPropagation();
        },
        reactDragover: (ev) => {
          super.HandleDragover(ev, View.Draginfo.ListedIReaction, () => {
            // console.log(ev.target);
          });
        },
        reactDrop: (ev, aboveReactIndex, toNtra) => {
          super.HandleDrop(ev, View.DragInfo.ListedIReaction, (data) => {
            // console.log(data)
            // console.log(typeof(data.index))
            if (toNtra.id === data.fromNtra.id) {
              // console.log("the same list");
              toNtra.moveElemAfterElemInList(data.reactIndex, aboveReactIndex, toNtra.reactionList);
            } else {
              // console.log("the diff list");
              const endOfthelist = toNtra.AddExistIReaction(data.react);
              toNtra.moveElemAfterElemInList(endOfthelist, aboveReactIndex, toNtra.reactionList);
              // console.log(endOfthelist + ":" + aboveReactIndex)
              data.fromNtra.DeleteIReaction(data.react);
            }
          });
        },
      },
    });

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
  }

  ReloadView() {
    if (GameProperties.ProjectLoaded()) {
      this.vModel.viewEnabled = true;
      this.vModel.interactions = GameProperties.instance.interactionList;
      this.vModel.objects = GameProperties.instance.objectList;
      this.vModel.states = GameProperties.instance.stateList;
      this.vModel.scenes = GameProperties.instance.sceneList;
      this.vModel.sounds = GameProperties.instance.soundList;
    } else {
      this.vModel.viewEnabled = false;
      this.vModel.interactions = null;
      this.vModel.objects = null;
      this.vModel.states = null;
      this.vModel.scenes = null;
      this.vModel.sounds = null;
    }
  }

  AddNewInteraction() {
    if (this.vModel.viewEnabled) {
      Interaction.NewInteraction();
    }
  }

  static MinimizeWindow(event, ntra) {
    const eventTarget = event.target.parentNode;
    const targetImg = event.target.closest('#interaction-box-minimize');
    const target = eventTarget.closest('.interaction-box');
    const targetChildren = target.childNodes;
    const minimizeSrc = document.getElementById('interaction-box-minimize').getAttribute('min-src');
    const maxmizeSrc = document.getElementById('interaction-box-minimize').getAttribute('max-src');

    if (ntra.max === true) {
      // target.setAttribute("max",'false');
      ntra.max = false;
      targetImg.src = maxmizeSrc;
      // console.log("let's minimize");
      // console.log(target.max);
      for (let i = 0; i < targetChildren.length; i += 1) {
        if (targetChildren[i].tagName === 'UL' || targetChildren[i].tagName === 'H6') {
          targetChildren[i].style.display = 'none';
        }
      }
      target.style.width = '250px';
    } else {
      // target.setAttribute("max",'true');
      ntra.max = true;
      targetImg.src = minimizeSrc;
      target.style.width = null;

      // console.log("let's maxmize");
      for (let k = 0; k < targetChildren.length; k += 1) {
        if (targetChildren[k].tagName === 'UL' || targetChildren[k].tagName === 'H6') {
          targetChildren[k].style.display = 'block';
        }
      }
    }
  }

  static EditInPlace(event, ntra) {
    // console.log(event);

    const targetTitle = event.target || event.srcElement;
    targetTitle.setAttribute('oldText', targetTitle.innerHTML); // not actually required. I use target just in case you want to cancel and set the original text back.
    const origianalText = targetTitle.innerHTML;

    const textBox = document.createElement('INPUT');
    textBox.setAttribute('type', 'text');
    textBox.style.width = '100px';
    textBox.value = targetTitle.innerHTML;


    textBox.onblur = () => {
      const newValue = textBox.value; // targetTitle.value
      // console.log("on blur");
      // console.log(newValue);

      if (newValue === '') {
        window.console.log('null detected');
        // targetTitle.parentNode.innerHTML = origianalText;
        targetTitle.innerHTML = origianalText;
      } else if (newValue.length > 25) {
        alert('Name should be less than 25 characters');
        targetTitle.innerHTML = origianalText;
        // targetTitle.parentNode.innerHTML = origianalText;
      } else {
        // if (obj == null){
        targetTitle.innerHTML = newValue;
        ntra.title = newValue;
        // } else {
        // obj.name = newValue;
        // targetTitle.parentNode.innerHTML = newValue;
        // }
      }
      // alert("Your new value: \n\n" + newValue);
    };

    targetTitle.innerHTML = '';

    targetTitle.appendChild(textBox);
  }

  // initBox(elem, ntra) {
  //   console.log(elem);
  //   //        var eventTarget = event.target.parentNode;
  //   //  		var targetImg = event.target.closest('#interaction-box-minimize');
  //   //  		var target = eventTarget.closest('.interaction-box');
  //   //    	var targetChildren = target.childNodes;
  //   //   		var minimizeSrc = document.getElementById("interaction-box-minimize").getAttribute("min-src");
  //   //   		var maxmizeSrc = document.getElementById("interaction-box-minimize").getAttribute("max-src");
  //   //
  //   //        if(ntra.max == true){
  //   //            targetImg.src = minimizeSrc;
  //   //    	    target.style.width = null;
  //   //            for(var k=0;k<targetChildren.length;k++){
  //   //                if(targetChildren[k].tagName === 'UL' || targetChildren[k].tagName === 'H6'){
  //   //                    targetChildren[k].style.display = 'block';
  //   //                }
  //   //            }
  //   //
  //   //        }else {
  //   //            targetImg.src = maxmizeSrc;
  //   //            for(var i=0;i<targetChildren.length;i++){
  //   //                if(targetChildren[i].tagName === 'UL' || targetChildren[i].tagName === 'H6'){
  //   //                    targetChildren[i].style.display = 'none';
  //   //                }
  //   //            }
  //   //    	   target.style.width = '250px';
  //   //        }

  //   console.log('here');
  // }
}

module.exports = InteractionView;
