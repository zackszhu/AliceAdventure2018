'use strict';

const {PATH} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

// class
var Image;

// variables
Image = function(_src, _name){
	this.src = _src;
	this.name = _name;
};

// static
Image.ImportImage = function(_src, _name = null){
	if (_name == null) _name = PATH.basename(_src, PATH.extname(_src));
	let image = new Image(_src, _name);
	GameProperties.AddImage(image);
	return image;
};

Image.DeleteImage = function(_image){
	return GameProperties.DeleteImage(_image);
};

// function
Image.prototype.DeleteThis = function(){
	return Image.DeleteImage(this);
};

module.exports = Image;