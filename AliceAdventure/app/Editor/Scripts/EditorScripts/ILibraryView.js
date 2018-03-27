'use strict';

const GameProperties = require('./GameProperties');
const Event = require('./Event');
const SceneObject = require('./SceneObject');
const State = require('./State');
const IEvent = require('./IEvent');
const IReaction = require('./IReaction');
const View = require('./View');

// class
var ILibraryView;

// variables
ILibraryView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "ILibraryView", _height, _width, _bindElementID);

	this.vModel = null;
};
ILibraryView.prototype = new View();

// static
ILibraryView.NewView = function(_elementID){
	var view = new ILibraryView(_elementID);
	view.InitView();
	return view;
};

// functions
ILibraryView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// Init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
			viewEnabled: false, 
			events: IEvent.Library, 
			states: [], 
			reactions: IReaction.Library
		}, 
		methods: {
			setIEvent: (evt, ntra)=>{ntra.SetIEvent(evt);}, 
			addCondition: (state, ntra)=>{ntra.AddCondition(state);},
			newState: ()=>{State.NewState('testState', false);}, 
			deleteState: (state)=>{state.DeleteThis();}, 
			addIReaction: (iReact, ntra, index)=>{ntra.AddIReaction(iReact, index);}
		}
	});

	// events
	Event.AddListener("reload-project", ()=>{this.ReloadView();});
};

ILibraryView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method

	if (GameProperties.ProjectLoaded()){
		this.vModel.viewEnabled = true;
		this.vModel.states = GameProperties.instance.stateList;
	} else {
		this.vModel.viewEnabled = false;
		this.vModel.states = [];
	}
};

module.exports = ILibraryView;