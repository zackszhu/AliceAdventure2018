var myGame = new GameManager();
myGame.init(1280,720,5);
myGame.sceneManager.createScenes(2);
myGame.states = {cat_is_feeded:false}


///------------------------------------------------------------///
myGame.sound.add('meow_unhappy', baseURL.nomalAssets + 'meow_unhappy.wav');
myGame.sound.add('meow_happy', baseURL.nomalAssets + 'meow_happy.wav');
myGame.sound.add('door', baseURL.nomalAssets + 'door.wav');

///-----------------------------------------------------------///

var back = Alice.Object.fromImage(baseURL.nomalAssets + 'room_basic.png');
back.anchor.set(0.5);
back.x = myGame.screenWidth / 2;
back.y = myGame.screenHeight / 2;
back.name = "back";
myGame.scene(0).addChild(back);


var door = Alice.Object.fromImage(baseURL.nomalAssets + 'door.png');
door.anchor.set(0.5);
door.x = myGame.screenWidth / 2;
door.y = myGame.screenHeight / 2 + 5;
door.scale.set(1);
door.name = "door";
door.interactive = true;
door.buttonMode = true;
door.on('pointerdown',function() {
    myGame.sound.play('door');
    myGame.sceneManager.nextScene();
});

myGame.scene(0).addChild(door);

var cat = Alice.Object.fromImage(baseURL.nomalAssets + 'cat.png');
cat.anchor.set(0.5);
cat.x = 250;
cat.y = 500;
cat.scale.set(0.8);
cat.name = "cat";
cat.interactive = true;
cat.buttonMode = true;
//cat.state = {
//    feeded:false
//};

cat.on('pointerdown',function() {
    if(!myGame.states.cat_is_feeded)
    {
        myGame.messageBox.startConversation(["Meow~","Hungry..."]);
        myGame.sound.play('meow_unhappy');
    }
    
    if(myGame.states.cat_is_feeded)
    {
        myGame.messageBox.startConversation(["Meow~","Love you~"]);
        myGame.sound.play('meow_happy');
    }
        
    
})

myGame.scene(0).addChild(cat);

//-------------------------------------------//
var back2 = Alice.Object.fromImage(baseURL.nomalAssets + 'kitchen.png');
back2.anchor.set(0.5);
back2.x = myGame.screenWidth / 2;
back2.y = myGame.screenHeight / 2;
back2.name = "back2";
myGame.scene(1).addChild(back2);


var door2 = Alice.Object.fromImage(baseURL.nomalAssets + 'door.png');
door2.anchor.set(0.5);
door2.x = 330;
door2.y = 390;
door2.scale.set(0.9);
door2.name = "door2";
door2.interactive = true;
door2.buttonMode = true;
door2.on('pointerdown',function() {
    PIXI.sound.play('door');
    myGame.sceneManager.jumpToScene(0);
});

myGame.scene(1).addChild(door2);


var knife = Alice.Object.fromImage(baseURL.nomalAssets + 'knife.png');
knife.anchor.set(0.5);
knife.x = 680;
knife.y = 300;
knife.scale.set(0.3);
knife.name = "knife";
knife.interactive = true;
knife.buttonMode = true;
knife.on('pointerdown',function() {
    myGame.inventory.add(knife);
});

myGame.scene(1).addChild(knife);

var jam = Alice.Object.fromImage(baseURL.nomalAssets + 'jam.png');
jam.anchor.set(0.5);
jam.x = 1030;
jam.y = 300;
jam.scale.set(0.3);
jam.name = "jam";
jam.interactive = true;
jam.buttonMode = true;
jam.on('pointerdown',function() {
    myGame.inventory.add(jam);
});

myGame.scene(1).addChild(jam);


var bread = Alice.Object.fromImage(baseURL.nomalAssets + 'bread.png');
bread.anchor.set(0.5);
bread.x = 550;
bread.y = 400;
bread.scale.set(0.4);
bread.name = "bread";
bread.interactive = true;
bread.buttonMode = true;
bread.on('pointerdown',function() {
    myGame.inventory.add(bread);
});

myGame.scene(1).addChild(bread);


var breadwithjam = Alice.Object.fromImage(baseURL.nomalAssets + 'breadwithjam.png');
breadwithjam.anchor.set(0.5);
breadwithjam.x = 550;
breadwithjam.y = 400;
breadwithjam.scale.set(0.4);
breadwithjam.name = "breadwithjam";
breadwithjam.visible = false;
myGame.scene(1).addChild(breadwithjam);

var knifewithjam = Alice.Object.fromImage(baseURL.nomalAssets + 'knifewithjam.png');
knifewithjam.anchor.set(0.5);
knifewithjam.x = 550;
knifewithjam.y = 400;
knifewithjam.scale.set(0.4);
knifewithjam.name = "knifewithjam";
knifewithjam.visible = false;
myGame.scene(1).addChild(knifewithjam);

//register events


myGame.inventory.interactionSystem.addCombineEvent(knife,jam,function(){
    
    myGame.inventory.remove(knife);
    myGame.inventory.remove(jam);
    knifewithjam.visible = true;
    myGame.inventory.add(knifewithjam);

});

myGame.inventory.interactionSystem.addCombineEvent(knifewithjam,bread,function(){
    myGame.inventory.remove(knifewithjam);
    myGame.inventory.remove(bread);
    breadwithjam.visible = true;
    myGame.inventory.add(breadwithjam);

});


myGame.inventory.interactionSystem.addUsedEvent(breadwithjam,cat,function(){
    myGame.states.cat_is_feeded = true;
    myGame.inventory.remove(breadwithjam);
    myGame.sound.play("meow_happy");
    myGame.messageBox.startConversation(["Yummy","I love you ~"]);
    
});

//--//
myGame.start(0);