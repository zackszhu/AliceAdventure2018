'use strict';

//const Vue = require('../../../Resources/Vue');
const Event = require('./Event');
const SceneObject = require('./SceneObject');
const View = require('./View');

// class
var PropertyView;

// variables
PropertyView = function(_height = -1, _width = -1){
	View.call(this, "PropertyView", _height, _width);

	this.BindObject = null;
	this.VModel = null;
	
};
PropertyView.prototype = new View();

// functions
PropertyView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// init data binding
	this.VModel = new Vue({
	  el: '#property-view',
	  data: {
	  	showProperty: false,
	    bindObj: this.BindObject
	  }
	});
	Event.AddListener("update-selected-object", this.UpdateSelectedObject);
	console.log("Init PropertyView finished");
};

PropertyView.prototype.SetBindObject = function(_sceneObj = null){
	console.log(_sceneObj);
	this.BindObject = _sceneObj;
	if (this.BindObject == null){ // null case
		this.VModel.shownProperty = false;
	} else { 
		this.VModel.shownProperty = true;
		this.VModel.bindObj = this.BindObject;
	}
}

PropertyView.prototype.UpdateSelectedObject = function(){
	console.log(this.SetBindObject);
	this.SetBindObject(SceneObject.Selection.objects[0]);
}

module.exports = PropertyView;