function CorvetteARExperience() {

    var _this = this;

    this.scene;
    this.renderer;
    this.textureformat = 'dxt';

    //VEHICLE ASSET VARS
    this.model;
    this.blob;
    this.wheelFL, this.wheelFR, this.wheelRL, this.wheelRR;
    this.brakeFL, this.brakeFR, this.brakeRL, this.brakeRR;
    this.pivotWheelFL, this.pivotWheelFR, this.pivotWheelRL, this.pivotWheelRR;
    this.pivotWheelFLRot, this.pivotWheelFRRot, this.pivotWheelRLRot, this.pivotWheelRRRot;
    this.doorDriver;
    this.doorCoDriver;
    this.trunkLid;
    this.roofTop;
    this.chromeParts;
    this.power;

    this.wheelTexture;
    this.discTexture;
    this.discTexture2 = new THREE.CompressedTexture();
    this.wheelTexture2;

    this.manager = new THREE.LoadingManager();
    this.loaderGLTF = new THREE.GLTFLoader(this.manager);
    THREE.DRACOLoader.setDecoderPath("./scripts/libs/draco/gltf/");
    this.dracoLoader = new THREE.DRACOLoader();
    this.loaderGLTF.setDRACOLoader(this.dracoLoader);

    this.loaderc = new THREE.KTXLoader();
    this.loaderTextures = new THREE.TextureLoader(_this.manager);

    this.paintPos = 1;

    this.paintTotal = [ 
        
        {code:'GC6',name:'Corvette Racing Yellow Tintcoat', color:0xFFC32B,roughness: .6,metalness: .2,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: .6},
        {code:'G8G',name:'Arctic White', color:0xfffaee,roughness: 0.8,metalness: 0.2,clearCoat: .7,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: 0.6},
        {code:'GKZ',name:'Torch Red', color:0xE11313,roughness: .6,metalness: .2,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: .6},
        {code:'GBA',name:'Black', color:0x111111,roughness: 0.5,metalness: 0.5,clearCoat: 1,clearCoatRoughness: 0.1,reflectivity: 0,envMapIntensity: 0.8},
        {code:'G7Q',name:'Watkins Glen Gray Metallic', color:0x2A3233,roughness: 0.6,metalness: 0.8,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: .8},
        {code:'GAN',name:'Blade Silver Metallic', color:0xC6CCD2,roughness: 0.6,metalness: 0.9,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: 0.7}
    ];

    this.defaultWheelType = "q8u";
    this.fl_q8u, this.fr_q8u, this.rl_q8u, this.rr_q8u;
    this.fl_q6x, this.fr_q6x, this.rl_q6x, this.rr_q6x;
    this.wheelPos = 1;
    this.wheelTotal = ["q8u","q6x","q6x_red","q6x_yellow","q6x_chrome"];

    this.shadowPlane;
    this.envPos = 0;
    this.envGUIArray = ['reflection000', 'reflection011', 'reflection010'];
    this.envGUICurrent = this.envGUIArray[this.envPos];

    this.tweener, this.tween, this.tween2, this.tween3;
    this.isRunningAnim = false;
    this.runningTweens = 0;

    initCorvette();

    function initCorvette() {
        _this.scene = scene;
        _this.renderer = renderer;

        _this.renderer.gammaInput = true;
        _this.renderer.gammaOutput = true;

        var canvas = document.createElement('canvas');
        canvas.id = "colorcanvas";
        canvas.width = 2;
        canvas.height = 2;
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);

        createMaterialLibrary();
        loadModels(vehicleLoaded);
    }

    function loadModels(callback) {
        _this.model = new THREE.Group();

        _this.pivotWheelFL = new THREE.Group();
        _this.pivotWheelFR = new THREE.Group();
        _this.pivotWheelRL = new THREE.Group();
        _this.pivotWheelRR = new THREE.Group();
        _this.pivotWheelFL.name = 'wheelFL';
        _this.pivotWheelFR.name = 'wheelFR';
        _this.pivotWheelRL.name = 'wheelRL';
        _this.pivotWheelRR.name = 'wheelRR';

        _this.pivotWheelFLRot = new THREE.Group();
        _this.pivotWheelFL.add(_this.pivotWheelFLRot);
        _this.pivotWheelFRRot = new THREE.Group();
        _this.pivotWheelFR.add(_this.pivotWheelFRRot);

        _this.pivotWheelRLRot = new THREE.Group();
        _this.pivotWheelRL.add(_this.pivotWheelRLRot);
        _this.pivotWheelRRRot = new THREE.Group();
        _this.pivotWheelRR.add(_this.pivotWheelRRRot);
        _this.pivotWheelRL.position.x += 410;
        _this.pivotWheelRL.position.y = 54.3;
        _this.pivotWheelRL.position.z = 80;
        _this.model.add( _this.pivotWheelRL );

        _this.pivotWheelRR.position.x = 410;
        _this.pivotWheelRR.position.y = 54.3;
        _this.pivotWheelRR.position.z -= 80;
        _this.model.add( _this.pivotWheelRR );
        
        _this.pivotWheelFL.position.x = 139;
        _this.pivotWheelFL.position.y = 54.3;
        _this.pivotWheelFL.position.z = 81;
        _this.pivotWheelFL.scale.set( .95, .95, .85);
        _this.pivotWheelFL.rotation.y = THREE.Math.degToRad(30);
        _this.model.add( _this.pivotWheelFL );
//               

        _this.pivotWheelFR.position.x = 139;
        _this.pivotWheelFR.position.y = 54.3;
        _this.pivotWheelFR.position.z -= 81;
        _this.pivotWheelFR.rotation.y = THREE.Math.degToRad(30);
        _this.model.add( _this.pivotWheelFR );


        loadGLTF('blob');

        //Load one GLB file including all meshes
        loadGLTF('exterior');

        //Load default exterior options
        loadGLTF('q8u');
        loadGLTF('q6x');
        loadGLTF('j56_front');
        loadGLTF('j56_rear');
        //loadGLTF('j57_front');
        //loadGLTF('j57_rear');
        loadGLTF('interior');

        _this.manager.onProgress = function (item, loaded, total) {
            var percentage = Math.round((loaded / total) * 100); 
            console.log( Math.round(percentage, 2) + '% downloaded' );
            handleLoadProgress(percentage);
        };
        _this.manager.onLoad = callback,
        _this.manager.onError = function () {
            console.log('there has been an error');
        };

    }

    function loadGLTF(name) {

        var fileName = name;

        _this.loaderGLTF.load("glb/" + fileName + ".glb", function(obj) {
            console.log(name);
            var parent;
            var j;

            function getMeshes(obj) {

                for (var k in obj) {
                    if (typeof obj[k] == "object" && obj[k] !== null) {
                        //                                           console.log(obj[k].parent);
                        if (obj[k].children) {
                            if (obj[k].type != "Mesh") {
                                getMeshes(obj[k].children)
                            } else {
                                _this.meshes.push(obj[k]);
                                //                                            console.log(obj[k]);
                            }

                        }
                    }
                }

            }
            // Load combined GLB file or individual GLB files
            if (name == 'exterior' || name == 'interior') {
                parent = obj.scene;
                console.log(obj.scene.children.length);

                for (var i = 0; i < obj.scene.children.length; i++) {
                    var objName = obj.scene.children[i].name;
                    objName = objName.slice(0, -3);
                    _this.meshes = [];
                    getMeshes(obj.scene.children[i].children);
                    prepareData(objName, _this.meshes);
                }
            } else {
                _this.meshes = [];
                getMeshes(obj.scene.children[0]);
                //                          console.log(_this.meshes);
                prepareData(name, _this.meshes);
            }
            //render('loadGLTF');
        });

    }

    function setWheelType(wType){

        if(wType == "q8u"){
            _this.fl_q6x.visible = false;
            _this.fr_q6x.visible = false;
            _this.rl_q6x.visible = false;
            _this.rr_q6x.visible = false;

            _this.fl_q8u.visible = true;
            _this.fr_q8u.visible = true;
            _this.rl_q8u.visible = true;
            _this.rr_q8u.visible = true;
        }else if(wType == "q6x"){
            _this.fl_q6x.visible = true;
            _this.fr_q6x.visible = true;
            _this.rl_q6x.visible = true;
            _this.rr_q6x.visible = true;

            _this.fl_q8u.visible = false;
            _this.fr_q8u.visible = false;
            _this.rl_q8u.visible = false;
            _this.rr_q8u.visible = false;
        }
    }

    function prepareData(name, meshArray) {
        //                var name = group.name;
        var group = new THREE.Group();
        var clone = new THREE.Group();

        group.name = name;

        if (name != 'blob') _this.model.add(group);

        for (var i = 0; i < meshArray.length; i++) {
            //                            console.log(meshArray[i]);    
            group.add(meshArray[i]);

            if (name != 'blob') meshArray[i].castShadow = true;
            if (name != 'blob') meshArray[i].receiveShadow = true;
            meshArray[i].material = _this.standardMat;
            //                    console.log(meshArray[i].material);
        }
        if (name == 'simple') {
            group.scale.set(5, 5, 5);
        }

        if (name == 'seat') {
            assignMaterials(group);

            clone = createClone(group);
            _this.model.add(clone);

        } else if (name == 'top') {
            assignMaterials(group);
            group.add(createClone(meshArray[1]));
        } else if (name == 'trunk') {
            //  Helper to position pivot point of door

            var translation = new THREE.Matrix4().makeTranslation(-366, -138, 0);
            for (var j = 0; j < meshArray.length; j++) {
                meshArray[j].geometry.applyMatrix(translation);
            }
            group.position.set(366, 138, 0);

            assignMaterials(group);
            _this.gtrunkLid = group;
        } else if (name == 'door' || name == 'door_inside') {
            // Helper to position pivot point of door

            var boxFW = new THREE.Box3().setFromObject(group);
            var translation = new THREE.Matrix4().makeTranslation(-222, -80, -90);
            for (var j = 0; j < meshArray.length; j++) {
                meshArray[j].geometry.applyMatrix(translation);
            }
            if (!_this.gdoorDriver) {
                _this.gdoorDriver = new THREE.Group();
                _this.gdoorDriver.position.set(222, 80, 90);
                _this.gdoorDriver.name = 'gdoor';
            }
            _this.gdoorDriver.add(group);
            assignMaterials(group);

            if (!_this.gdoorCoDriver) {
                _this.gdoorCoDriver = new THREE.Group();
                _this.gdoorCoDriver.position.set(222, 80, -90);
                _this.gdoorCoDriver.name = 'gdoor_clone';
            }
            clone = createClone(group);
            clone.name = group.name + '_clone';
            _this.gdoorCoDriver.add(clone);

            _this.model.add(_this.gdoorDriver);
            _this.model.add(_this.gdoorCoDriver);


        } else if (name == 'paint') {
            assignMaterials(group);
            mergeMeshes(group);

        } else if (name == 'paint2') {
            assignMaterials(group);
            clone = createClone(group);
            _this.model.add(clone);
        } else if (name == 'frontlamp') {
            assignMaterials(group);
            mergeMeshes(group);
            clone = createClone(group);
            _this.model.add(clone);

            mergeClone(group, clone);

        } else if (name == 'front') {
            assignMaterials(group);
            group.add(createClone(meshArray[0]));
        } else if (name == 'rear') {
            assignMaterials(group);
            group.add(createClone(meshArray[2]));
            group.add(createClone(meshArray[16]));
            group.add(createClone(meshArray[17]));
            group.add(createClone(meshArray[19]));
            group.add(createClone(meshArray[20]));
            group.add(createClone(meshArray[21]));
            group.add(createClone(meshArray[22]));

        } else if (name == 'side') {
            assignMaterials(group);

            for (var i = 0; i < meshArray.length; i++) {
                if (i != 13 && i != 14 && i != 15 && i != 16) {
                    if (i == 5 || i == 6 || i == 7 || i == 8 || i == 9) {
                        // 
                        clone.add(createClone(meshArray[i], false)); // don't mirror logo
                        meshArray[i].rotation.y = THREE.Math.degToRad(-180);
                        meshArray[i].position.x = 574.7;
                    } else
                        clone.add(createClone(meshArray[i]));
                }
                //                        console.log (meshArray.length);
            }

            mergeMeshes(group);
            _this.model.add(clone);

            // Individual created clone needs to be merged separatly
            mergeMeshes(clone);

            mergeClone(group, clone);


        } else if (name == 'rearlamp') {
            assignMaterials(group);
            mergeMeshes(group);
            clone = createClone(group);
            _this.model.add(clone);
        } else if (name == 'chrome') {
            assignMaterials(group);
            clone.add(createClone(meshArray[2]));
            clone.add(createClone(meshArray[3]));
            clone.add(createClone(meshArray[4]));
            clone.add(createClone(meshArray[5]));
            _this.model.add(clone);
        } else if (name == 'parts') {
            assignMaterials(group);
            group.add(createClone(meshArray[3]));
            group.add(createClone(meshArray[9]));
            group.add(createClone(meshArray[10]));
            group.add(createClone(meshArray[12]));
            group.add(createClone(meshArray[13]));
            group.add(createClone(meshArray[6]));

        } else if (name == 'window') {
            // Solution for alpha flackering issue 
            meshArray[0].renderOrder = 10000;
        } else if (name == 'q6x' || name == 'q8u') {
            // _this.pivotWheelRLRot.remove(_this.wheelRL);
            // _this.pivotWheelRRRot.remove(_this.wheelRR);
            // _this.pivotWheelFLRot.remove(_this.wheelFL);
            // _this.pivotWheelFRRot.remove(_this.wheelFR);

            _this.wheelFL = group;

            assignMaterials(group);

            var boxFW = new THREE.Box3().setFromObject(_this.wheelFL);
            //                        console.log(boxFW);

            for (var j = 0; j < _this.wheelFL.children.length; j++) {
                boxFW.getCenter(_this.wheelFL.children[j].position);

                _this.wheelFL.children[j].position.multiplyScalar(-1);
            }

            _this.wheelFR = _this.wheelFL.clone();
            _this.wheelFR.rotation.y = THREE.Math.degToRad(180);
            _this.wheelRL = _this.wheelFL.clone();

            _this.wheelRR = _this.wheelRL.clone();
            _this.wheelRR.rotation.y = THREE.Math.degToRad(180);

            _this.pivotWheelFLRot.add(_this.wheelFL);
            _this.pivotWheelFRRot.add(_this.wheelFR);
            _this.pivotWheelRLRot.add(_this.wheelRL);
            _this.pivotWheelRRRot.add(_this.wheelRR);

            if(name == "q6x"){
                _this.fl_q6x = _this.wheelFL;
                _this.fr_q6x = _this.wheelFR;
                _this.rl_q6x = _this.wheelRL;
                _this.rr_q6x = _this.wheelRR;
            }else if(name == "q8u"){
                _this.fl_q8u = _this.wheelFL;
                _this.fr_q8u = _this.wheelFR;
                _this.rl_q8u = _this.wheelRL;
                _this.rr_q8u = _this.wheelRR;
            }

        } else if (name == 'j56_front' || name == 'j57_front') {

            _this.pivotWheelFL.remove(_this.brakeFL);
            _this.pivotWheelFR.remove(_this.brakeFR);

            assignMaterials(group);

            var boxFW = new THREE.Box3().setFromObject(group);
            for (var j = 0; j < group.children.length; j++) {
                boxFW.getCenter(group.children[j].position);
                // this re-sets the mesh position
                group.children[j].position.multiplyScalar(-1);
            }

            _this.brakeFL = group;

            if (name == 'j57_front')
                group.position.y -= 0.3;

            _this.brakeFR = createClone(_this.brakeFL);

            _this.brakeFR.position.x -= 139;
            if (name == 'j57_front')
                _this.brakeFR.position.y -= 53.3;
            else
                _this.brakeFR.position.y -= 54.3;
            _this.brakeFR.position.z += 81;

            _this.pivotWheelFL.add(_this.brakeFL);
            _this.pivotWheelFR.add(_this.brakeFR);
        } else if (name == 'j56_rear' || name == 'j57_rear') {
            _this.model.remove(_this.brakeRL);
            _this.model.remove(_this.brakeRR);

            assignMaterials(group);

            _this.brakeRL = group;
            if (name == 'j57_rear')
                _this.brakeRL.position.y += 1.3;
            _this.brakeRR = createClone(_this.brakeRL);
            if (name == 'j57_rear')
                _this.brakeRR.position.y += 1.3;
            _this.model.add(_this.brakeRR);
        } else if (name == 'blob') {

            meshArray[0].material = _this.matBlob;
            meshArray[0].geometry.center();
            group.rotation.x = THREE.Math.degToRad(-90);
            group.rotation.z = THREE.Math.degToRad(60);
            group.position.x = 300;
            group.position.y = 614.5;
            _this.blob = group;
            _this.blob.visible = false;
            _this.scene.add(_this.blob);
        } else {
            // If nothing has to be done with the geometries we can assign the materials
            assignMaterials(group);
        }
        //render('prepareData');
        //                
    }

    function assignMaterials(model) {

        var meshes = [];

        if (model.name == 'seat') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPlasticDark;
            model.children[1].material = _this.matCarbon;
            model.children[3].material = _this.matLogoWhite;
            model.children[3].material = _this.matLogoRed;
            model.children[5].material = _this.matLeather;
            model.children[6].material = _this.matLeather;
            model.children[7].material = _this.matPlasticDark;
            model.children[8].material = _this.matChrome;
            model.children[9].material = _this.matLogoRed;
            model.children[10].material = _this.matBelt;
            model.children[11].material = _this.matChrome;
            console.log(model.children[9].material);
        } else if (model.name == 'center_console') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matLeather;
            //                                        model.children[1].material = _this.matBlack;
            model.children[3].material = _this.matChrome;
            //                                        model.children[5].material = _this.matDecor;
            model.children[13].material = _this.matPlasticDark;
            model.children[14].material = _this.matDecor;
            model.children[17].material = _this.matLogoRed;
            model.children[18].material = _this.matLogoRed;
            model.children[19].material = _this.matPlasticDark;
            model.children[21].material = _this.matSeam;
            //                                        model.children[22].material = _this.matChrome;
            model.children[24].material = _this.matPlasticGloss;
            model.children[26].material = _this.matChrome;
            model.children[27].material = _this.matChrome;
            model.children[28].material = _this.matPlasticGloss;
            //                                        model.children[7].material = _this.matLogoWhite;
        } else if (model.name == 'roof_ground') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPrimer;
            model.children[0].material = _this.matLogoRed;
            model.children[3].material = _this.matCarpet;
            model.children[4].material = _this.matChrome;
            model.children[5].material = _this.matLeather;
            model.children[6].material = _this.matLogoWhite;
            model.children[7].material = _this.matLogoWhite;
            model.children[9].material = _this.matMirrorGlas;
            //                                        model.children[10].material = _this.matMirrorGlas;
            model.children[11].material = _this.matAlu;
            model.children[18].material = _this.matAlu;
            //                                        console.log(model.children[3].material);

        } else if (model.name == 'cockpit') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPlasticDark;
            model.children[0].material = _this.matSpeaker;
            model.children[1].material = _this.matLeather;
            model.children[2].material = _this.matDecor;
            model.children[6].material = _this.matChrome;
            model.children[8].material = _this.matBlack;
            model.children[9].material = _this.matSeam;
            model.children[12].material = _this.matBlack;
            model.children[13].material = _this.matPlasticGloss;
            model.children[15].material = _this.matPlasticGloss;
            model.children[16].material = _this.matLogoRed;
            model.children[17].material = _this.matLogoWhite;
            model.children[18].material = _this.matLogoWhite;
            model.children[19].material = _this.matPlasticGloss;
            model.children[20].material = _this.matLogoRed;
            model.children[21].material = _this.matLogoBlue;
            model.children[23].material = _this.matLogoWhite;
            model.children[24].material = _this.matPlasticGloss;
        } else if (model.name == 'door_inside') {
            for (var i = 0; i < model.children.length; i++) {
                model.children[i].material = _this.matLeather;
                //                                               if (model.children[i].material != _this.mat)
                //                                                model.children[i].material.shadowSide = 2;
            }

            model.children[1].material = _this.matBlack;
            model.children[3].material = _this.matDecor;
            model.children[5].material = _this.matDecor;
            model.children[6].material = _this.matPlasticDark;
            model.children[7].material = _this.matLogoWhite;
        } else if (model.name == 'steering') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matLeather;
            model.children[0].material = _this.matLogoRed;
            model.children[1].material = _this.matCarbon;
            model.children[2].material = _this.matSeam;
            model.children[3].material = _this.matDecor;
            model.children[4].material = _this.matPlasticGloss;
            model.children[5].material = _this.matChrome;
            model.children[6].material = _this.matBlack;
            model.children[7].material = _this.matLogoYellow;
            model.children[8].material = _this.matLogoRed;
            model.children[9].material = _this.matLogoWhite;
            model.children[11].material = _this.matPlasticDark;
        } else if (model.name == 'paint2') {
            model.children[1].material = _this.matPaint;
            model.children[0].material = _this.matPlasticDark;
        } else if (model.name == 'paint') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPaint;
        } else if (model.name == 'trunk') {
            model.children[1].material = _this.matPrimer;
            model.children[2].material = _this.matPaint;
            model.children[0].material = _this.matAlu;

            model.children[3].material = _this.matWindowPrivat;
            model.children[4].material = _this.matBlack;
        } else if (model.name == 'black') {
            model.children[0].material = _this.matBlack;
        } else if (model.name == 'front') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPlasticGloss;
            model.children[1].material = _this.matWindow;
            model.children[2].material = _this.matPrimer;
            model.children[3].material = _this.matPlasticDark;
            model.children[4].material = _this.matPlasticDark;
            model.children[5].material = _this.matPlasticDark;
            model.children[6].material = _this.matPlasticGloss;
            model.children[7].material = _this.matChrome;
            model.children[8].material = _this.matLogoRed;
            model.children[9].material = _this.matAluDark;
            model.children[10].material = _this.matLogoWhite;
            model.children[11].material = _this.matLogoYellow;
            model.children[13].material = _this.matPrimer;
        } else if (model.name == 'frontlamp') {
            //                                        for (var i = 0; i < model.children.length; i++)
            //                                            model.children[i].material = _this.matChrome;
            model.children[0].material = _this.matGlasDark;
            //                                        model.children[0].material.opacity = 0;
            model.children[1].material = _this.matChrome;
            model.children[2].material = _this.matGlas;
            model.children[4].material = _this.matAlu;
            model.children[5].material = _this.matChrome;
            model.children[6].material = _this.matPlasticGloss
            model.children[7].material = _this.matPlasticGloss

            //                                        model.children[8].material = _this.matGlasOrange;

        } else if (model.name == 'rearlamp') {
            model.children[0].material = _this.matPlasticGloss;
            model.children[1].material = _this.matGlas;
            model.children[2].material = _this.matGlasRed;
            model.children[3].material = _this.matGlasRed;
            model.children[4].material = _this.matAluDark;
            model.children[5].material = _this.matBlack;
        } else if (model.name == 'rear') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPlastic;
            //                                        model.children[0].material = _this.matLogoRed;
            //                                        model.children[1].material = _this.matLicense;
            model.children[0].material = _this.matPlasticGloss;
            model.children[1].material = _this.matLicense;
            model.children[2].material = _this.matPlasticGloss;
            model.children[3].material = _this.matGlasRed;
            model.children[4].material = _this.matChrome;
            model.children[5].material = _this.matPlastic;
            model.children[6].material = _this.matPlasticGloss;
            model.children[7].material = _this.matPlasticDark;
            model.children[8].material = _this.matPlastic;
            model.children[9].material = _this.matPlastic;
            // Logo Corvette
            model.children[10].material = _this.matChrome;
            model.children[11].material = _this.matChrome;
            model.children[12].material = _this.matAluDark;
            model.children[13].material = _this.matLogoWhite;
            model.children[14].material = _this.matLogoYellow;
            model.children[15].material = _this.matLogoRed;

            model.children[16].material = _this.matPlasticGloss;
            model.children[17].material = _this.matPlastic;
            model.children[18].material = _this.matPlasticGloss;

            model.children[19].material = _this.matPlasticDark;
            model.children[20].material = _this.matChrome;
            model.children[21].material = _this.matAluDark;
            model.children[22].material = _this.matAluDark;


        } else if (model.name == 'side') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matAlu;
            model.children[0].material = _this.matGlasRed;
            model.children[1].material = _this.matGlasRed;
            model.children[2].material = _this.matPlasticDark;
            model.children[3].material = _this.matPrimer;
            model.children[4].material = _this.matPlasticGloss;
            model.children[5].material = _this.matChrome;
            model.children[6].material = _this.matAlu;
            model.children[7].material = _this.matLogoRed;
            model.children[8].material = _this.matLogoYellow;
            model.children[9].material = _this.matPlasticGloss;
            model.children[10].material = _this.matPlasticGloss;
            model.children[11].material = _this.matPlasticDark;
            model.children[12].material = _this.matPlasticGloss;
            model.children[13].material = _this.matLogoRed;
            model.children[14].material = _this.matAlu;
            model.children[15].material = _this.matLogoRed;
            model.children[16].material = _this.matAlu;
            model.children[17].material = _this.matGlasOrange;
            model.children[18].material = _this.matGlasOrange;
            model.children[19].material = _this.matPlastic;
            model.children[20].material = _this.matPlasticGloss;
            model.children[21].material = _this.matPlasticGloss;
            model.children[22].material = _this.matPlasticGloss;
            model.children[23].material = _this.matPlasticDark;
            model.children[24].material = _this.matPlasticGloss;
            model.children[25].material = _this.matWindowPrivat;
            model.children[26].material = _this.matBlack;
            model.children[27].material = _this.matPrimer;
            model.children[28].material = _this.matPrimer;
        } else if (model.name == 'j56_front' || model.name == 'j57_front' || model.name == 'j57_rear') {
            model.children[0].material = _this.matAlu;
            model.children[1].material = _this.matCaliper;
            model.children[2].material = _this.matCaliperLogo;
            if (model.name == 'j57_front')
                model.children[3].material = _this.matDisk2;
            else
                model.children[3].material = _this.matDisk;
            model.children[4].material = _this.matAluDark;
            model.children[5].material = _this.matAlu;
        } else if (model.name == 'j56_rear') {
            model.children[0].material = _this.matAlu;
            model.children[1].material = _this.matAlu;
            model.children[2].material = _this.matCaliper;
            model.children[3].material = _this.matCaliperLogo;
            model.children[4].material = _this.matDisk;
            model.children[5].material = _this.matAluDark;
            model.children[6].material = _this.matAlu;
        } else if (model.name == 'top') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matPrimer;
            model.children[2].material = _this.matPaint;
            model.children[3].position.y = -.5;

        } else if (model.name == 'door') {
            model.children[0].material = _this.matPrimer;
            model.children[1].material = _this.matPaint;
            model.children[2].material = _this.matPlastic;
            model.children[3].material = _this.matPrimer;
            model.children[4].material = _this.matPlasticGloss;
            model.children[5].material = _this.matPrimer;
            model.children[6].material = _this.matAluDark;
            model.children[7].material = _this.matAluDark;
            model.children[8].material = _this.matPlasticDark;
            model.children[9].material = _this.matPaint;
            model.children[10].material = _this.matAlu;
            model.children[11].material = _this.matMirrorGlas;
            model.children[12].material = _this.matGlas;
        } else if (model.name == 'windowpane') {
            //                                        console.log(model.children[k]);
            //                                        model.children[k].castShadow = false;
            //                                        model.children[k].receiveShadow = false;
            model.children[0].material = _this.matWindow;
            model.children[1].material = _this.matWindow;
            model.children[2].material = _this.matWindowPrivat;
            model.children[3].material = _this.matWindowPrivat;
        }
        //                                    else if (model.name.indexOf('wheel') != -1)
        //                                    {
        else if (model.name == 'q6x') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matAluDark;
            model.children[1].material = _this.matStripe;
            model.children[0].material = _this.matAlloyDark;
            model.children[2].material = _this.matAlu;
            model.children[3].material = _this.matAlu;
            model.children[4].material = _this.matLogoWhite;
            model.children[5].material = _this.matLogoRed;
            model.children[6].material = _this.matAlloyDark;
            model.children[7].material = _this.matPlastic;
            model.children[8].material = _this.matLogoYellow;
            model.children[9].material = _this.matPlastic;
            model.children[10].material = _this.matTire;
            model.children[11].material = _this.matTread;
        } else if (model.name == 'q8u') {
            for (var i = 0; i < model.children.length; i++)
                model.children[i].material = _this.matAluDark;
            model.children[0].material = _this.matAlloy;
            model.children[1].material = _this.matAlu;
            model.children[2].material = _this.matPlastic;
            model.children[3].material = _this.matLogoWhite;
            model.children[4].material = _this.matLogoRed;
            model.children[5].material = _this.matAlu;
            model.children[6].material = _this.matPlasticGloss;
            model.children[7].material = _this.matLogoYellow;
            model.children[8].material = _this.matAlu;
            model.children[9].material = _this.matTire;
            model.children[10].material = _this.matTread;
        }
    }

    function createClone(obj, mirror) {

        var clonedObj;
        var mirror = mirror;
        if (mirror == undefined) mirror = true;
        //                var materialClone;
        var mS = (new THREE.Matrix4()).identity();
        //set -1 to the corresponding axis
        //                mS.elements[10] = -1;
        mS.elements[10] = -1;

        if (obj.type == 'Object3D' || obj.type == 'Group') {

            if (obj.type == 'Object3D')
                clonedObj = new THREE.Object3D();
            else
                clonedObj = new THREE.Group();
            if (mirror) clonedObj.applyMatrix(mS);

            for (var j = 0; j < obj.children.length; j++) {
                //                        materialClone = obj.children[j].material.clone();
                var newMesh = new THREE.Mesh(obj.children[j].geometry.clone(), obj.children[j].material);
                if (obj.children[j].castShadow) newMesh.castShadow = true;
                if (obj.children[j].receiveShadow) newMesh.receiveShadow = true;
                newMesh.material.side = 2; // Clickable clones = 2
                //                        newMesh.material.shadowSide = 2;
                clonedObj.add(newMesh);
            }
        } else if (obj.type == 'Mesh') {
            clonedObj = new THREE.Mesh(obj.geometry.clone(), obj.material); //obj.material.clone()
            if (obj.castShadow) clonedObj.castShadow = true;
            if (obj.receiveShadow) clonedObj.receiveShadow = true;
            if (mirror) clonedObj.applyMatrix(mS);
            clonedObj.material.side = 2; // Clickable clones = 2
            //                    clonedObj.material.shadowSide = 2;

        }
        //                console.log(clonedObj);
        return clonedObj;

    }

    function mergeClone(group, clone){
        //NO ACTION
    }

    function mergeMeshes(group){
        //NO ACTION
    }

    function createMaterialLibrary() {
        _this.matBlob = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        _this.matSimple = new THREE.MeshStandardMaterial({
            color: 0x555555,
            side: 2
        });
        _this.standardMat = new THREE.MeshPhysicalMaterial({
            color: 0x2A3233,
            shadowSide: 2,
            envMapIntensity: 0.2,
            roughness: 0.2,
            metalness: 0
        });

        //LOAD TIRE AND DISC TEXTURES
        var formats = {
                astc: _this.renderer.extensions.get( 'WEBGL_compressed_texture_astc' ),
                etc1: _this.renderer.extensions.get( 'WEBGL_compressed_texture_etc1' ),
                s3tc: _this.renderer.extensions.get( 'WEBGL_compressed_texture_s3tc' ),
                pvrtc: _this.renderer.extensions.get( 'WEBGL_compressed_texture_pvrtc' )
        };
        if (formats.astc) 
            _this.textureformat = "astc";
        else if (formats.pvrtc) 
            _this.textureformat = "pvrtc";

        _this.wheelTexture = _this.loaderc.load('textures/model/exterior/rubber_tread_' + _this.textureformat + '.ktx', function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.wrapT = THREE.RepeatWrapping;
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.set(1.3, 1);
            texture.offset.set(0.36, 1);
        });
        _this.discTexture = _this.loaderc.load('textures/model/exterior/brake_disc_' + _this.textureformat + '.ktx', function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
        });
        _this.discTexture2 = _this.loaderc.load('textures/model/exterior/brake_disc_' + _this.textureformat + '.ktx', function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.offset.set(-0.45, -0.35);
            texture.repeat.set(1.7, 1.7);
            console.log(texture);
        });

        _this.wheelTexture2 = _this.loaderc.load('textures/model/exterior/rubber_shell_' + _this.textureformat + '.ktx', function(texture) {
            texture.repeat.set(1.02, 1.02);
            texture.offset.set(-0.01, -0.01);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
        });

        // Black Interior & Holes      
        _this.matBlack = new THREE.MeshBasicMaterial({
            color: 0,
            side: 2
        });
        _this.matLicense = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            map: _this.loaderc.load('textures/model/exterior/licenseplate_' + _this.textureformat + '.ktx', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearFilter;
                texture.repeat.set(1, 2);
            })
        });

        _this.matPrimer = new THREE.MeshStandardMaterial({
            color: 0x030303,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0.2,
            side: 2
        });

        _this.matInteriorBlack = new THREE.MeshStandardMaterial({
            color: 0x191919,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0.2,
            side: 0
        });



        _this.matPlasticGloss = new THREE.MeshStandardMaterial({
            color: 0, //0xb91524
            roughness: 0,
            metalness: 1,
            envMapIntensity: 1
            //blending: 0
        });
        _this.matWhite = new THREE.MeshBasicMaterial({
            //transparent: true,
            color: 0xffffff,
            side: 2
        });

        _this.matPlastic = new THREE.MeshStandardMaterial({
            color: 0x222222, //0xb91524
            roughness: 0.5,
            metalness: 0,
            envMapIntensity: .5,
            side: 2
        });
        _this.matPlasticDark = new THREE.MeshStandardMaterial({
            color: 0x151515, //0xb91524
            roughness: .6,
            metalness: 0,
            envMapIntensity: 0.2,
            side: 2
        });

        _this.matSeam = new THREE.MeshStandardMaterial({
            color: 0x777777, //0xb91524
            roughness: 1,
            metalness: 0,
            envMapIntensity: .8,
            side: 0
        });

        _this.matBelt = new THREE.MeshStandardMaterial({
            color: 0xff0000, //0xb91524
            roughness: 1,
            metalness: 0,
            map: _this.loaderTextures.load('textures/model/interior/belt.jpg', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
            }),
            envMapIntensity: 1,
            side: 2
        });

        _this.matLeather = new THREE.MeshStandardMaterial({
            color: 0x757575, //0x757575
            roughness: .8,
            metalness: 0,
            map: _this.loaderTextures.load('textures/model/interior/leather.jpg', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(2.25, 2.25);
            }),
            normalMap: _this.loaderTextures.load('textures/model/interior/leather_normal.jpg', function(texture) {
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(2.25, 2.25);
            }),
            normalScale: new THREE.Vector3(1, 1),
            envMapIntensity: 0.5,
            side: 2
        });

        _this.matSpeaker = new THREE.MeshStandardMaterial({
            color: 0x757575, //0x757575
            roughness: .8,
            metalness: 0,
            map: _this.loaderTextures.load('textures/model/interior/speaker.jpg', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                //                                texture.flipY = false;
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(2.25, 2.25);
                //                                texture.offset.set(0, -1);
            }),
            normalMap: _this.loaderTextures.load('textures/model/interior/speaker_normal.jpg', function(texture) {
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(2.25, 2.25);
            }),
            normalScale: new THREE.Vector3(1, 1),
            envMapIntensity: 0.5,
            side: 2
        });

        _this.matDecor = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.5,
            metalness: 0.5,
            envMapIntensity: .8,
            side: 0
        });

        _this.matCarbon = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0,
            map: _this.loaderTextures.load('textures/model/interior/carbon.jpg', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
            }),
            envMapIntensity: .8,
            side: 0
        });

        _this.matCarpet = new THREE.MeshStandardMaterial({
            color: 0,
            roughness: 1,
            metalness: 0,
            normalMap: _this.loaderTextures.load('textures/model/interior/carpet_normal.jpg', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                //                                texture.repeat.set(1,1);
            }),
            normalScale: new THREE.Vector3(1, 1),
            map: _this.loaderTextures.load('textures/model/interior/carpet.jpg', function(texture) {
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.wrapT = THREE.RepeatWrapping;
                texture.wrapS = THREE.RepeatWrapping;
                //                                texture.repeat.set(1,1);
            }),
            envMapIntensity: 1,
            side: 2
        });

        _this.matTread = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 1,
            metalness: 0.1,
            map: _this.wheelTexture,
            bumpMap: _this.wheelTexture,
            bumpScale: 1.5,
            envMapIntensity: 0.1,
            side: 0
        });
        _this.matTire = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            map: _this.wheelTexture2,
            envMapIntensity: .3,
            side: 0
        });

        // Bremsscheibe
        _this.matDisk = new THREE.MeshPhysicalMaterial({
            color: 0x666666,
            roughness: 0.5,
            map: _this.discTexture,
            metalness: 1,
            clearCoat: .5,
            clearCoatRoughness: 0.5,
            //                        envMap: sphericalTexture,
            reflectivity: 0,
            side: 2,
        });
        //                console.log(_this.matDisk);
        // Bremsscheibe
        _this.matDisk2 = new THREE.MeshPhysicalMaterial({
            color: 0x666666,
            roughness: 0.5,
            map: _this.discTexture2,
            metalness: 1,
            clearCoat: .5,
            clearCoatRoughness: 0.5,
            //                        envMap: sphericalTexture,
            reflectivity: 0,
            side: 2,
        });
        //                console.log(_this.matDisk2);
        // Bremsklotz
        _this.matCaliper = new THREE.MeshStandardMaterial({
            color: 0xFFC32B,
            roughness: 0.5,
            metalness: 0.5,
            envMapIntensity: .6
        });
        _this.matCaliper.map = createColorTexture('#FFC32B');
        _this.matCaliper.color.setHex(0xffffff);

        _this.matCaliperLogo = new THREE.MeshBasicMaterial({
            color: 0,
            side: 2
        });

        _this.matStripe = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.5,
            metalness: 0.5,
            envMapIntensity: .6
        });
        //                _this.matStripe.map = createColorTexture('#111111');
        //                _this.matStripe.color.setHex( 0xffffff );

        _this.matPaint = new THREE.MeshPhysicalMaterial({
            color: _this.paintTotal[_this.paintPos - 1].color, //0x0B1940
            roughness: _this.paintTotal[_this.paintPos - 1].roughness,
            metalness: _this.paintTotal[_this.paintPos - 1].metalness,
            clearCoat: _this.paintTotal[_this.paintPos - 1].clearCoat,
            clearCoatRoughness: _this.paintTotal[_this.paintPos - 1].clearCoatRoughness,
            envMapIntensity: _this.paintTotal[_this.paintPos - 1].envMapIntensity,
            reflectivity: _this.paintTotal[_this.paintPos - 1].reflectivity
        });
        _this.matPaint.map = createColorTexture('#' + _this.matPaint.color.getHexString());
        _this.matPaint.color.setHex(0xffffff);
        _this.matPaint.shadowSide = 1;
        //                console.log('""""""""""""""""""""""""');
        //                console.log(_this.matPaint.castShadow);




        _this.matMirror = new THREE.MeshStandardMaterial({
            //                        color: paintTotal[1],
            color: new THREE.Color().setHex(0),
            roughness: 1,
            metalness: 1,
            side: 2
        });
        //                    matMirror.envMap.mapping = THREE.EquirectangularReflectionMapping;

        _this.matMirrorGlas = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0,
            metalness: 0,
            //                        opacity: .9,
            transparent: false,
            side: 2
        });
        //                matMirrorGlas.envMap.mapping = THREE.EquirectangularReflectionMapping;
        //                    matMirrorGlas.envMap.mapping = THREE.SphericalReflectionMapping;


        _this.matWindow = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0,
            metalness: 1,
            opacity: .8,
            transparent: true,
            side: 2
        });
        _this.matWindowPrivat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0,
            metalness: 1,
            opacity: .65,
            transparent: true,
            side: 2
        });
        //                matWindow = new THREE.MeshPhysicalMaterial( { 
        //                        color: 0x232a32,//x520000
        //                        roughness: 0,
        //                        roughnessMap: false,
        //                        metalness: 0,
        //                        metalnessMap: false,
        //                        clearCoat: 1,
        //                        clearCoatRoughness: 0,
        //                        envMapIntensity: .8,
        //                        reflectivity: 0,
        //                        opacity: .45,
        //                        transparent: true,
        //                        side: 2
        //                        } );

        _this.matGlas = new THREE.MeshStandardMaterial({
            color: 0x666666,
            depthWrite: true,
            roughness: 0,
            metalness: .5,
            opacity: .45,
            transparent: true,
            //                            wireframe: true,
            side: 2
        });

        _this.matGlasDark = new THREE.MeshStandardMaterial({
            color: 0x444444,
            depthWrite: false,
            roughness: 1,
            metalness: 0,
            opacity: .45,
            transparent: true,
            //                            wireframe: true,
            side: 1
        });

        _this.matGlasRed = new THREE.MeshStandardMaterial({
            color: 0xff0000, //0xc80009
            roughness: 0,
            metalness: .75,
            //                            depthWrite: false,
            envMapIntensity: .7,
            opacity: .65,
            transparent: true,
            side: 2
        });
        _this.matGlasOrange = new THREE.MeshStandardMaterial({
            color: 0xF44900, //0xc80009
            roughness: 0,
            metalness: .75,
            //                            depthWrite: false,
            envMapIntensity: .7,
            opacity: .65,
            transparent: true,
            side: 2
        });
        _this.matAlu = new THREE.MeshPhysicalMaterial({
            color: 0x555555,
            roughness: 0.2,
            metalness: 0.4,
            clearCoat: 1,
            clearCoatRoughness: 0,
            envMapIntensity: .4,
            reflectivity: .6,
            metalnessMap: false,
            roughnessMap: false
        });
        _this.matAluDark = new THREE.MeshPhysicalMaterial({
            color: 0x222222,
            roughness: 0,
            metalness: 0.4,
            clearCoat: 1,
            clearCoatRoughness: 0,
            envMapIntensity: .1,
            reflectivity: 1,
            metalnessMap: false,
            roughnessMap: false 
        });

        _this.matAlu2 = new THREE.MeshPhysicalMaterial({
            color: 0x555555,
            roughness: 0.2,
            metalness: 0.4,
            clearCoat: 1,
            clearCoatRoughness: 0,
            envMapIntensity: .2,
            reflectivity: .6,
            metalnessMap: false,
            roughnessMap: false
        });

        _this.matDSLogo = new THREE.MeshStandardMaterial({
            color: 0, //0xa80202
            roughness: 1,
            metalness: 0,
            envMapIntensity: 1,
            side: 2
        });
        
        _this.matAlloy = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            roughness: 0.4,
            metalness: 1,
            clearCoat: 1,
            clearCoatRoughness: 0.3,
            envMapIntensity: .7,
            reflectivity: .2,
            side: 2
        });
        _this.matAlloyContrast = new THREE.MeshPhysicalMaterial({
            color: 0xff0000,
            roughness: .5,
            metalness: .5,
            clearCoat: 1,
            clearCoatRoughness: 0,
            envMapIntensity: .6,
            reflectivity: .5,
            side: 2
        });
        _this.matAlloyDark = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            roughness: .5,
            metalness: .5,
            clearCoat: 1,
            clearCoatRoughness: 0.2,
            envMapIntensity: .4,
            reflectivity: .2,
            side: 2
        });
        _this.matChrome = new THREE.MeshPhysicalMaterial({
            color: 0x999999,
            roughness: 0.3,
            metalness: 1,
            clearCoat: 1,
            clearCoatRoughness: 0.8,
            envMapIntensity: 1,
            reflectivity: 1,
            side: 2,
        });
        //                physicalMaterial = matAlloyContrast;
        _this.matLogoRed = new THREE.MeshPhysicalMaterial({
            color: 0xFF0000,
            roughness: 0.5,
            metalness: 0.5,
            clearCoat: 1,
            clearCoatRoughness: 0.5,
            envMapIntensity: .5,
            side: 2,
        });
        _this.matLogoWhite = new THREE.MeshBasicMaterial({
            //transparent: true,
            color: 0xffffff,
            side: 2
        });
        _this.matLogoYellow = new THREE.MeshBasicMaterial({
            //transparent: true,
            color: 0xFFB603,
            side: 2
        });
        _this.matLogoBlue = new THREE.MeshBasicMaterial({
            //transparent: true,
            color: 0x008EDE,
            side: 2
        });

        _this.physicalMaterial = _this.matPaint;

        loadHDRReflection(_this.envGUICurrent);

    }

    function loadHDRReflection(env){
        var genCubeUrls = function( prefix, postfix ) {
            return [
                prefix + 'left' + postfix, prefix + 'right' + postfix,
                prefix + 'top' + postfix, prefix + 'bottom' + postfix,
                prefix + 'back' + postfix, prefix + 'front' + postfix
            ];
        };
        
        var hdrUrls = genCubeUrls( './textures/' + env + '/reflection.' , ".hdr" ); //paris
        new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, hdrUrls, function ( hdrCubeMap ) {

            var pmremGenerator = new THREE.PMREMGenerator( hdrCubeMap );
            pmremGenerator.update( _this.renderer );

            var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
            pmremCubeUVPacker.update( _this.renderer );

            _this.hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
            _this.hdrCubeRenderTarget.texture.encoding = THREE.RGBM16Encoding;
            
            _this.matTire.envMap = _this.matTread.envMap = _this.matCaliper.envMap = _this.matAlu.envMap = _this.matAluDark.envMap = _this.matAlu2.envMap = _this.matGlasRed.envMap = _this.matGlas.envMap = _this.matPrimer.envMap = _this.matChrome.envMap = _this.matLogoRed.envMap = _this.matMirror.envMap = _this.matAlloy.envMap = _this.matAlloyContrast.envMap = _this.matAlloyDark.envMap =_this.matGlasOrange.envMap = _this.matWindowPrivat.envMap = _this.matWindow.envMap = _this.matMirror.envMap = _this.standardMat.envMap = _this.matSeam.envMap =_this.matPlasticDark.envMap = _this.matPlastic.envMap = _this.matPlasticGloss.envMap = _this.matLicense.envMap = _this.matDisk.envMap = _this.matDisk2.envMap = _this.matStripe.envMap = _this.matPaint.envMap = _this.matDSLogo.envMap = _this.matMirrorGlas.envMap = _this.matBelt.envMap = _this.matCarpet.envMap = _this.matDecor.envMap = _this.matLeather.envMap = _this.matSpeaker.envMap = _this.matCarbon.envMap = _this.hdrCubeRenderTarget.texture;

        } );
    }

    function createColorTexture(color){
        var canvas = document.getElementById("colorcanvas");
        
        var ctx = canvas.getContext("2d");
        ctx.fillStyle=color;
        ctx.fillRect(0,0,2,2);
//                console.log(color);
        var texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    function changeColorByCode(code) {
            
        var index = _this.paintTotal.map(e => e.code).indexOf(code);
        _this.matPaint.color.setHex( _this.paintTotal[index].color );
        // Map canvas texture to avoid gamma correction for colors
        _this.matPaint.map = createColorTexture('#' + _this.matPaint.color.getHexString());
        //Reset color value to white color
        _this.matPaint.color.setHex( 0xffffff );
        
        _this.physicalMaterial.roughness = _this.matPaint.roughness = _this.paintTotal[index].roughness;
        _this.physicalMaterial.metalness = _this.matPaint.metalness = _this.paintTotal[index].metalness;
        _this.physicalMaterial.clearCoat = _this.matPaint.clearCoat = _this.paintTotal[index].clearCoat;
        _this.physicalMaterial.clearCoatRoughness = _this.matPaint.clearCoatRoughness = _this.paintTotal[index].clearCoatRoughness;
        _this.physicalMaterial.reflectivity = _this.matPaint.reflectivity = _this.paintTotal[index].reflectivity;
        _this.physicalMaterial.envMapIntensity = _this.matPaint.envMapIntensity = _this.paintTotal[index].envMapIntensity;
        
        _this.paintPos = index + 1;

        //render('changeColorByCode');
        // Update Color GUI manually
        if (_this.colorGUI) _this.colorGUI.object = _this.paintTotal[index];
        if (_this.colorGUI) _this.colorGUI.updateDisplay(); 
        
        
    }

    function changeWheel(num) {

        var currentWheel = _this.wheelPos;
        if (num == "next")
            if (currentWheel == _this.wheelTotal.length)
                num = 1;
            else
                num = currentWheel + 1;
        if (num == "prev")
            if (currentWheel == 1)
                num = _this.wheelTotal.length;
            else
                num = currentWheel - 1;

        switch (num) {
            case 1:
                //loadGLTF('q8u');
                setWheelType('q8u');
                break;
            case 2:
                //loadGLTF('q6x');
                setWheelType('q6x');
                changeWheelStripe(3);
                if (_this.copyMaterial) _this.matAlloyDark.copy(_this.copyMaterial);
                break;
            case 3:
                //loadGLTF('q6x');
                setWheelType('q6x');
                changeWheelStripe(1);
                if (_this.copyMaterial) _this.matAlloyDark.copy(_this.copyMaterial);
                break;
            case 4:
                //loadGLTF('q6x');
                setWheelType('q6x');
                changeWheelStripe(2);
                if (_this.copyMaterial) _this.matAlloyDark.copy(_this.copyMaterial);
                break;
            case 5:
                //loadGLTF('q6x');
                setWheelType('q6x');
                changeWheelStripe(3);
                if (!_this.copyMaterial) _this.copyMaterial = _this.matAlloyDark.clone();
                _this.matAlloyDark.copy(_this.matChrome);
                break;
            default:
                break;
        }
        //                loadGLTF('wheel'+num);

        _this.wheelPos = num;

    }

    function changeWheelStripe(num) {
        switch (num) {
            case 1:
                _this.matStripe.color.setHex(0xFFC32B);
                break;
            case 2:
                _this.matStripe.color.setHex(0xE50004);
                break;
            case 3:
                _this.matStripe.color.setHex(0x111111);
                break;
            default:
                break;
        }

        _this.matStripe.map = createColorTexture('#' + _this.matStripe.color.getHexString());
        _this.matStripe.color.setHex(0xffffff);
    }

    return {
        setVetteVar: function(){
            theVette = _this.model;
        },

        setColor: function(_code){
            changeColorByCode(_code);
        },

        setWheels: function(wType) {
          setWheelType(wType);
        },

        nextWheel: function() {
          changeWheel('next');
        },

        prevWheel: function() {
          changeWheel('prev');
        }
    }
}