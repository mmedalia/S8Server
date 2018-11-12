function Corvette3DExperience(url, options) { 

            "use strict";
    
            var _this = this;
    
            this.options = options || {};
    
            this._antialias = this.options.antialias || 'idle'; // 'always' or 'none' (default: 'idle')

//            this._loadingStart = this.options.loadingStart || function() {}; 
            this._loadingDone = this.options.loadingDone || function() {};
//            this._loadingError = this.options.loadingError || function() {};
    
            this._gui = this.options.gui || false;
            // Background color        
            this._clearColor =  this.options.backgroundColor || 0x7F7F7F;
            this._light = this.options.light || false;
            this._castShadow = this.options.castShadow || false;
            this._reflection = this.options.reflection || '000';
            this._hotspots = false;  
    
//            THREE.Cache.enabled = true;
    

            this.stats;

            this.gui = new dat.GUI( {autoPlace: false} );
            this.colorGUI;
            this.physicalMaterial;
    
            this.meshes = [];

            this.camera, this.controls, this.scene, this.sceneBG, this.sceneSprites, this.renderer, this.model, this.interior, this.fade;
            this.cameraHUD, this.sceneHUD, this.cameraHUDStereo;
            this.cameraBG;
            this.check, this.cancelStereo, this.stereo;
            this.plane;
            this.pressMouseDown = new THREE.Vector2();

            this.topView = false;
            this.wheelInitPos = true;

            this.dirLight, this.ambient, this.directionalLight, this.hemiLight;

            this.imgformat = '.png';
            this.textureformat = 'dxt';
            this.imgsize = '1024';

            this.iframe = false;
//            this.gmcLogo;

            
            this.environment = 'real';
            this.currentBG = 'city';
            this.mountains;
            this.city;
            this.uniforms;
            this.sky;
            this.colorCode;
            
            this.copyShader, this.renderPass, this.ssaaRenderPassP;

            this.worientation = 'landscape';

            this.cubeTarget, this.cubeCamera, this.mirrorLHCamera, this.mirrorRHCamera;

            this.projector, this.raycaster;
            this.touchables = [];
            this.hotspots, this.hotspot_2D, this.hotspotTouchDown;
            this.hotspot_color, this.hotspot_wheel;

            this.SCREEN_WIDTH = window.innerWidth;
			this.SCREEN_HEIGHT = window.innerHeight;
            this.SHADOW_MAP_WIDTH = 4096, this.SHADOW_MAP_HEIGHT = 4096;
            this.NEAR = 10, this.FAR = 20;

            this.wheelFL, this.wheelFR, this.wheelRL, this.wheelRR;
            this.brakeFL, this.brakeFR, this.brakeRL, this.brakeRR;
            this.pivotWheelFL, this.pivotWheelFR, this.pivotWheelRL, this.pivotWheelRR;
            this.pivotWheelFLRot, this.pivotWheelFRRot, this.pivotWheelRLRot, this.pivotWheelRRRot;

            this.tweener, this.tween, this.tween2, this.tween3;

            this.isRunningAnim = false;
            this.runningTweens = 0;

            this.isRunningCam = false;
            this.isRunningWheel = false;
            this.runningCameraTween = 0;

            this.currentCamera = 4;
            this.totalCamera = 8;

            this.meshShadow = [];
            this.materialArray = [];

            this.envPos = 0;
    
            if (getURLParameter('reflection')) _this._reflection = getURLParameter('reflection');
    
            this.envGUIArray = ['reflection000', 'reflection011', 'reflection010']; //'reflection006', 
            //['reflection' + this._reflection, 'paris'];
            this.envGUICurrent = this.envGUIArray[this.envPos];
//            this.matGUIArray = ['matPaint', 'matTire'];
//            this.matGUICurrent = matGUIArray[0];
            

            this.effectFXAA, this.bloomPass, this.effectGrayScale, this.glitchPass, this.renderModel, this.renderEnvironment, this.effectSobel;
			this.composer;

            this.effect;
            this.aa = false;
            this.postprocessing = {};
            
            this.groundshadow;

            this.boundbox, this.objCube;
            this.mouseDown = false;

            this.timerScroll = null;
            this.timerResize = null;

            this.rotateModel = false;
            this.rotateDir = undefined;

            this.doorDriver;
            this.doorCoDriver;
            this.trunkLid;
            this.roofTop;

            this.chromeParts;

            this.power;
    
            this.copyMaterial;

            this.SPEED = 0.015;
            
            this.hdrCubeMap;
            this.hdrCubeRenderTarget;

            this.gdoorDriver;
            this.gdoorCoDriver;
            this.gtrunkLid;

            // Hammer manager
            this.mc;

            this.blob, this.matBlob;

            this.manager = new THREE.LoadingManager();
            this.loaderGLTF = new THREE.GLTFLoader(this.manager);
    
            THREE.DRACOLoader.setDecoderPath("./scripts/libs/draco/gltf/");
			this.dracoLoader = new THREE.DRACOLoader();
			this.loaderGLTF.setDRACOLoader(this.dracoLoader);
    
//            this.loaderc = new THREE.DDSLoader();
            this.managerEnv = new THREE.LoadingManager();
            this.loaderEnv = new THREE.KTXLoader(_this.managerEnv);
            this.loaderc = new THREE.KTXLoader();
            this.loaderTextures = new THREE.TextureLoader(_this.manager);
    
            this.path = "";
            this.urls = [];

            this.paintPos = 1;

            this.paintTotal = [ 
                
                {code:'GC6',name:'Corvette Racing Yellow Tintcoat', color:0xFFC32B,roughness: .6,metalness: .2,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: .6},
                {code:'G8G',name:'Arctic White', color:0xfffaee,roughness: 0.8,metalness: 0.2,clearCoat: .7,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: 0.6},
//                {code:'G8G',name:'Arctic White', color:0,roughness: 0,metalness: 1,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: 1},
                {code:'GKZ',name:'Torch Red', color:0xE11313,roughness: .6,metalness: .2,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: .6},
                {code:'GBA',name:'Black', color:0x111111,roughness: 0.5,metalness: 0.5,clearCoat: 1,clearCoatRoughness: 0.1,reflectivity: 0,envMapIntensity: 0.8},
                {code:'G7Q',name:'Watkins Glen Gray Metallic', color:0x2A3233,roughness: 0.6,metalness: 0.8,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: .8},
//                {code:'G1F',name:'Ceramic Matrix Gray', color:0xC0CDDA,roughness: 0.6,metalness: 0.7,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: .7},
                {code:'GAN',name:'Blade Silver Metallic', color:0xC6CCD2,roughness: 0.6,metalness: 0.9,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: 0.7}
//                {code:'GTR',name:'Admiral Blue Metallic', color:0x13377C,roughness: 0.6,metalness: 0.9,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: 0.6},
//                {code:'G1G',name:'Longbeach Red Metallic Tintcoat', color:0x871225,roughness: .6,metalness: .2,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 0,envMapIntensity: .6},
            ];
    
            this.caliperPos = 1;
            this.caliperTotal = ["red","yellow","black","grey"];
    
            this.trimPos = 1;
            this.trimTotal = ["black","black","black"];

            this.wheelPos = 1;
            this.wheelTotal = ["q8u","q6x","q6x_red","q6x_yellow","q6x_chrome"];
    
            this.brakePos = 1;
            this.brakeTotal = ["j56","j57"];

//            this.lensflare = new THREE.Lensflare();

            this.initialise = false;

            this.positions;

            this.equirecTexture;
            this.sphericalTexture;

            this.paramsModel = {
                groundshadow: true, positionX: 120, positionY: 30, positionZ: 0, rotationY: 170, scale: 1.5, wheelPositionY: -20
			};

            this.paramsCam = {
                controls: true, 
                autoRotate: false, 
                fov: 42, 
                //x: -267, y: 194, z: -248
                positionX: -267, //976, 
                positionY: 194,// 218, 
                positionZ: -248,//-450, 
                orbitX: 300, 
                orbitY: 60, 
                orbitZ: 0,
                minDist: 810,
                maxDist: 810
//                orbitX: 40, 
//                orbitY: 130, 
//                orbitZ: 0
			};
    
//    300;
//                    group.position.y = 400;
//                    group.position.y = 614;
//    orbitX: 276, 
//                orbitY: 60, 
//                orbitZ: 6,
  
//    _this.model.position.set(40,130,0);

            this.paramsLight = {
                x: 0,y: 30, z: 0
			};
            this.paramsEnv = {
                location: '',
                color: 0xFFFFFF,
                texture: false,
                visible: false,
                laquer: false
			};


            this.paramsMat = {
                name: 'matPaint',
                material: undefined,
                color: 0xffffff,
                roughness: 0.0,
                metalness: 0.0,
                clearCoat: 0.75,
                clearCoatRoughness: 0,
                envMapIntensity: 0.46,
                reflectivity: 0.2,
                metalnessMap: false,
                roughnessMap: false,
                bumpScale: 0,
                bumpMap: false,
                normalScale: 0.5,
                normalMap: false,
                envMap: "HDR",
				projection: 'normal',
				background: true
			};
            this.paramsBloom = {
				exposure: 1.0,
                enabled: false,
                bloomThreshold: 0.97,
				bloomStrength: 3,
				bloomRadius: 0.88
			};



            this.matStdParams = {
				roughness: 0.044676705160855, // calculated from shininess = 1000
				metalness: 0.0
			};

            this.matStdFloor = new THREE.MeshStandardMaterial( this.matStdParams );
			this.matStdObjects = new THREE.MeshStandardMaterial( this.matStdParams );

			this.geoFloor = new THREE.BoxGeometry( 2000, 1, 2000 );
//			this.geoBox = new THREE.BoxGeometry( Math.PI, Math.sqrt( 2 ), Math.E );
//			this.geoSphere = new THREE.SphereGeometry( 1.5, 32, 32 );
//			this.geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 100, 16 );

			this.mshStdFloor = new THREE.Mesh( this.geoFloor, this.matStdFloor );
//			this.mshStdBox = new THREE.Mesh( geoBox, matStdObjects );
//			this.mshStdSphere = new THREE.Mesh( geoSphere, matStdObjects );
//			this.mshStdKnot = new THREE.Mesh( geoKnot, matStdObjects );


//            this.textureFlare0 = loaderTextures.load( 'textures/lensflare/lensflare0.png' );
//            this.textureFlare3 = loaderTextures.load( 'textures/lensflare/lensflare3.png' );

//            this.discTexture;
//           
//            _this.discTexture = this.loaderTextures.load( 'textures/model/disc.jpg', function ( texture ) {
////					texture.flipY = true;
//                    texture.magFilter = THREE.LinearFilter;
//                    texture.minFilter = THREE.LinearFilter;
//				} );

            this.wheelTexture;
            this.discTexture;
            this.discTexture2 = new THREE.CompressedTexture();
            this.wheelTexture2;
//            this.wheelTextureNormal2;

            this.textures = {
                color : { url : 'images/color.png' },
                wheel : { url : 'images/wheels.png' }
//                environment : { url : 'images/environment.png' },
//                spin : { url : 'images/spin.png' }
            };

//loaderTextures.load('textures/env/map.png')
//            this.textures = {
//                spherical : { url : 'textures/map_laquer.png' },
////                blob : { url : 'textures/env/blob.jpg' },
//                specular : { url : 'textures/roughness_map.jpg' }
//                
//            };

            function getURLParameter(name) {
              var value = decodeURIComponent((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, ""])[1]);
              return (value !== 'null') ? value : false;
            }

            this.clock = new THREE.Clock();

            this.groundMirrorMaterial;

            this.param = { example: 'standard' };

            function getTexture( name ) {

                var texture = _this.textures[ name ].texture;

                if ( ! texture ) {

                    texture = _this.loaderTextures.load( _this.textures[ name ].url );
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                }

                return texture;

            }

            this.cubemap;
    
    
            function exportGLTF( input ) {

				var gltfExporter = new THREE.GLTFExporter();

				var options = {
					trs: true,
					onlyVisible: true,
					truncateDrawRange: true,
					binary: true,
					forceIndices: true,
					forcePowerOfTwoTextures: true
				};
				gltfExporter.parse( input, function( result ) {

					if ( result instanceof ArrayBuffer ) {

						saveArrayBuffer( result, 'scene.glb' );

					} else {

						var output = JSON.stringify( result, null, 2 );
						console.log( output );
						saveString( output, 'scene.gltf' );

					}

				}, options );

			}
    
            var link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link ); // Firefox workaround, see #6594

			function save( blob, filename ) {

				link.href = URL.createObjectURL( blob );
				link.download = filename;
				link.click();

				// URL.revokeObjectURL( url ); breaks Firefox...

			}

			function saveString( text, filename ) {

				save( new Blob( [ text ], { type: 'text/plain' } ), filename );

			}


			function saveArrayBuffer( buffer, filename ) {

				save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

			}

            function mobileCheck() {
                  _this.check = false;
                  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))_this.check = true})(navigator.userAgent||navigator.vendor||window.opera);
                  return _this.check;
            }

            mobileCheck();

//           testJPG2000();
            init();

			function init() {
                
                

                var canvas = document.createElement('canvas');

                canvas.id = "colorcanvas";
                canvas.width = 2;
                canvas.height = 2;

                var body = document.getElementsByTagName("body")[0];
                body.appendChild(canvas);
                
                _this.cancelStereo = true;
//                aa = true;
//                alert(window.devicePixelRatio);
//                alert(mobileCheck());
                if (!_this.check)
                    {
//                        _this.SHADOW_MAP_WIDTH = 4096; //4096 
//                        _this.SHADOW_MAP_HEIGHT = 4096; //4096
                        _this.imgsize = '2048';
                    }
                
                
                

                    
                // Animation states > false = closed or closing & true = opened or opening 
                _this.doorDriver = false;
                _this.doorCoDriver = false;
                _this.trunkLid = false;
                _this.roofTop = true;
                
				_this.scene = new THREE.Scene();
                _this.scene.name = '3DExcite Scene';
                
                
                _this.sceneBG = new THREE.Scene();
                
//                scene.fog = new THREE.Fog(0x333333, 300, 700);
                _this.sceneSprites = new THREE.Scene();
                _this.sceneHUD = new THREE.Scene();
                _this.sceneHUD.name = 'HUD Scene';
                
                
                
                
                
                _this.raycaster = new THREE.Raycaster();

				_this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } ); //alpha: true

                _this.renderer.physicallyCorrectLights = true;
                _this.renderer.physicallyBasedShading = true;
                _this.renderer.preserveDrawingBuffer = true;
                _this.renderer.autoClear = false;
				_this.renderer.setClearColor( _this._clearColor, 0 ); //0x333333
				_this.renderer.setPixelRatio( window.devicePixelRatio );
				_this.renderer.setSize( _this.SCREEN_WIDTH, _this.SCREEN_HEIGHT );
                _this.renderer.sortObjects = false;
                
                
                _this.managerEnv.onLoad = function () {
//                    loadHDRReflection(_this.envGUICurrent);
                }
                

//                renderer.toneMapping = THREE.ReinhardToneMapping;
//				renderer.toneMappingExposure = 2.75;
//                renderer.toneMapping = THREE.ReinhardToneMapping;
//                renderer.toneMappingExposure = 2;
//                renderer.toneMappingWhitePoint = 4;
				
//                console.log(renderer.toneMappingExposure);
                
                if (!_this.check) _this.renderer.shadowMap.enabled = true;
//                _this.renderer.shadowMap.bias = .0005;
                _this.renderer.shadowMap.type = 1;
                console.log(_this.renderer.shadowMap);
//                _this.renderer.shadowMap.radius = 0;
                
//                renderer.shadowMap.enabled = true; // if (!check) 
                
//                if (check) 
//                    renderer.shadowMap.type = 1; //THREE.PCFShadowMap 1 //THREE.PCFSoftShadowMap 2 //THREE.BasicShadowMap 0 
//                else 
//                    renderer.shadowMap.type = 2; //THREE.PCFShadowMap 1 //THREE.PCFSoftShadowMap 2 //THREE.BasicShadowMap 0 
                

//                if (check) 
                    _this.renderer.shadowMap.autoUpdate = true;
                
//                 _this.renderer.shadowMap.renderReverseSided = false; removed!!
//                renderer.shadowMap.renderReverseSided = true; //CullFaceBack CullFaceFront
//                renderer.shadowMap.renderSingleSided = false;
//                renderer.shadowMap.shadowScale = 0;
                
            
                _this.renderer.gammaInput = true;
				_this.renderer.gammaOutput = true;
//                renderer.gammaFactor = 3;
                
//                effect = new THREE.StereoEffect(renderer); 
                
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
//                else if (formats.s3tc) textureformat = "dxt";

				_this.container = document.getElementById( 'container' );
                
				_this.container.appendChild( _this.renderer.domElement );
                _this.renderer.domElement.style.touchAction = "none";
                _this.renderer.domElement.style.width = 0 + 'px';
                _this.renderer.domElement.style.height = 0 + 'px';
                
                var customContainer = document.getElementById('gui-container');
//                if (customContainer) customContainer.appendChild(_this.gui.domElement);
                

                _this.wheelTexture = _this.loaderc.load( 'textures/model/exterior/rubber_tread_' + _this.textureformat + '.ktx', function ( texture ) {
    //					texture.flipY = true;
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearFilter;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.repeat.set(1.3, 1);
                        texture.offset.set(0.36, 1);
                    } );
                _this.discTexture = _this.loaderc.load( 'textures/model/exterior/brake_disc_' + _this.textureformat + '.ktx', function ( texture ) {
    //					texture.flipY = true;
//                        alert(texture.mipmaps);
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearFilter;
//                        texture.wrapS = THREE.RepeatWrapping;
//                        alert(texture.clone()); //  = texture.clone();
//                        _this.discTexture2 = texture.clone();
//                        _this.discTexture2.updateMatrix();
//                        _this.discTexture2.needsUpdate = true;
//                        _this.discTexture2.offset.set(0.36, 1);
                    } );
                _this.discTexture2 = _this.loaderc.load( 'textures/model/exterior/brake_disc_' + _this.textureformat + '.ktx', function ( texture ) {
    //					texture.flipY = true;
//                        alert(texture.mipmaps);
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearFilter;
                        texture.offset.set(-0.45, -0.35);
                        texture.repeat.set(1.7, 1.7);
                    console.log(texture);
                    } );
                
//                var tex = new THREE.Texture.clone();
                _this.wheelTexture2 = _this.loaderc.load( 'textures/model/exterior/rubber_shell_' + _this.textureformat + '.ktx', function ( texture ) {
    //					texture.flipY = true;
                        texture.repeat.set(1.02, 1.02);
                        texture.offset.set(-0.01, -0.01);
//                        texture.wrapT = THREE.RepeatWrapping;
//                        texture.wrapS = THREE.RepeatWrapping;
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearFilter;
                    } );
//                _this.wheelTextureNormal2 = _this.loaderc.load( 'textures/model/exterior/rubber_shell_normal_' + _this.textureformat + '.ktx', function ( texture ) {
//                        texture.repeat.set(1.01, 1.01);
//                        texture.wrapT = THREE.RepeatWrapping;
//                        texture.wrapS = THREE.RepeatWrapping;
//                        texture.magFilter = THREE.LinearFilter;
//                        texture.minFilter = THREE.LinearFilter;
//                    } );
                
            
//	            mouse = new THREE.Vector3();
                
//                ctx = renderer.domElement.getContext('webgl');
//                console.log(ctx)

				_this.camera = new THREE.PerspectiveCamera( _this.paramsCam.fov, _this.SCREEN_WIDTH / _this.SCREEN_HEIGHT, 1, 10000 );
//				camera.position.x = -250;
//                camera.position.y = 300;
//                camera.position.z = 300;
                //338.5833148885371, y: 210.89294321680475, z: 225.61059419605232
                
                //-482.2862377748162 101.58583034023457 214.2607419514469
//                camera.position.set(-127, 483, 144);
                
                _this.cameraBG = new THREE.PerspectiveCamera( 90, _this.SCREEN_WIDTH / _this.SCREEN_HEIGHT, 1, 10000 );
                
                _this.scene.add(_this.camera);
                
                _this.sceneBG.add(_this.cameraBG);
                
//                scene.matrixAutoUpdate = false;
                
                
                initPostprocessing();
                
//                var effectController  = {
//
//					focus: 		320.0,
//					aperture:	0.5,
//					maxblur:	2.0
//
//				};

//				var matChanger = function( ) {
//
//					postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
//					postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture * 0.00001;
//					postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;
//                    render('GUI');
//
//				};
                
                
                // background image = backplates
                // canvas = 2D plane; texture = loaded JPG images 
//                var repeatX, repeatY;
//                tex1.wrapS = THREE.ClampToEdgeWrapping;
//                tex1.wrapT = THREE.RepeatWrapping;
//                repeatX = canvasWidth * textureSetting.h / (canvasHeight * textureSetting.w);
//                repeatY = 1;
//                tex1.repeat.set(repeatX, repeatY);
//                tex1.offset.x = (repeatX - 1) / 2 * -1;
                
                
                
                _this.cameraHUD = new THREE.OrthographicCamera( _this.SCREEN_WIDTH / - 2, _this.SCREEN_WIDTH / 2, _this.SCREEN_HEIGHT / 2, _this.SCREEN_HEIGHT / - 2, 0, 100 );
				_this.cameraHUD.position.z = 1;
//                
//                cameraHUDStereo = new THREE.OrthographicCamera( SCREEN_WIDTH/4, SCREEN_WIDTH - SCREEN_WIDTH/4, 0, SCREEN_HEIGHT, 0, 100 );
//				cameraHUDStereo.position.z = 1;
                
                _this.sceneHUD.add(_this.cameraHUD);
//                sceneHUD.add(cameraHUDStereo);
                

                

				_this.controls = new THREE.OrbitControls( _this.camera, _this.renderer.domElement );
//				controls.addEventListener( 'change', render ); // remove when using animation loop
                _this.controls.addEventListener('start', startControl);
                _this.controls.addEventListener('move', moveControl);
                _this.controls.addEventListener('end', endControl);
                _this.controls.addEventListener('startscroll', startScroll);
                _this.controls.addEventListener('endscroll', endScroll);
                
				// enable animation loop when using damping or autorotation
//				if (check) 
//                    controls.rotateSpeed = .15;
//                else 
//                    controls.rotateSpeed = .30;
                _this.controls.rotateSpeed = .25;  // negative if you want to change direction 
                _this.controls.enableDamping = true;
				_this.controls.dampingFactor = .20;
                _this.controls.zoomSpeed = .25;
                
//                controls.rotateSpeed = .25;
//                controls.enableDamping = true;
//				controls.dampingFactor = 0.25;
//                controls.zoomSpeed = .25;
                
                // camera constrains
                _this.controls.enableZoom = true; // false
                _this.controls.enablePan = true; // false
                
//                controls.minDistance = 600;
////                if (check) 
////                    controls.maxDistance = 950;
////                else 
//                    controls.maxDistance = 950;
//                
                _this.controls.minPolarAngle = THREE.Math.degToRad(0); // radians Math.radians(-90);
                _this.controls.maxPolarAngle = THREE.Math.degToRad(78); // radians
//                _this.controls.minDistance = 0;
//                _this.controls.maxDistance = Infinity;
                _this.controls.minDistance = _this.paramsCam.minDist;
                _this.controls.maxDistance = _this.paramsCam.maxDist;
//                controls.autoplay = true
//                controls.enabled = false;
                // x = rot, y = grün, z = blau (AxisHelper)
                
                // Exterior

                _this.camera.position.set
                (
                    _this.paramsCam.positionX, _this.paramsCam.positionY, _this.paramsCam.positionZ
                );

                _this.controls.target.set
                (
                    _this.paramsCam.orbitX,_this.paramsCam.orbitY,_this.paramsCam.orbitZ
                );
                
                _this.controls.update();

                // Interior
//                box.position.x = 160;
//                box.position.y = 60;
                
                
//                camera.position.set(0.004307636960709501, 0.002263377886820721, -0.012015028949758274);
                
                //camera.rotation.y = THREE.Math.degToRad(90);
                //0.004307636960709501, y: 0.002263377886820721, z: -0.012015028949758274}
//                controls.target.set
//                (
//                    0,
//                    0,
//                    -0.01
//				);
                
//                cubemap = new THREE.CubeTexture();
//                cubemap.format = THREE.RGBFormat;
//    //            cubemap.mapping = THREE.CubeReflectionMapping;
//
//                cubeCamera = new THREE.CubeCamera( 1, 2000, 1024 );
//                cubeCamera.position.y = 40;
////                scene.add(cubeCamera);
//                cubeTarget = cubeCamera.renderTarget.texture;
//                cubeTarget.generateMipmaps = true;
//                
//                cubeTarget.format = THREE.RGBFormat;
//                cubeTarget.minFilter = THREE.LinearMipMapLinearFilter;
                
                
//                mc = new Hammer.Manager(container, {
//                        recognizers: []
//                    });
//                var press = new Hammer.Press();
////                mc.add(press);
//                var swipe = new Hammer.Swipe();
//                mc.add(swipe); //if (check) 
//                
//                var pinch = new Hammer.Pinch();
//                mc.add(pinch);
//
//                
//                // Tap recognizer with minimal 2 taps
//                
//                mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
//                mc.get('doubletap').set({ interval: 300});
//                // Single tap recognizer
//                mc.add( new Hammer.Tap({ event: 'singletap' }) );
//                
//                
////                mc.on("pinchstart", function(ev) //pinchin pinchout 
////                    { 
////                        console.log(ev.type);
////                    
////                 });
//                // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
////                mc.get('doubletap').recognizeWith('singletap');
//////                    // we only want to trigger a tap, when we don't have detected a doubletap
////                mc.get('singletap').requireFailure('doubletap');
//                
//                mc.on("swipeup swipedown swipeleft swiperight", function(ev) 
//                    { 
//                    
//                        if (controls.enabled == false)
//                        {
//                            
//                            if (ev.type == "swipeleft")
//                            {
//                                prevCamera();
//                            } 
//                            else if (ev.type == "swiperight")
//                            {
//                                nextCamera();
//                            }
//                            if (ev.type == "swipedown")
//                            {
//                                if (screenfull.enabled && screenfull.isFullscreen) 
//                                    screenfull.exit();
//                            } 
//                            else if (ev.type == "swipeup")
//                            {
//                                if (screenfull.enabled && !screenfull.isFullscreen) 
//                                    screenfull.request(); 
//                            }
//                        }
//                    
//                    });
//                
////                
//
//                
//                mc.on("singletap doubletap", function(ev) //singletap doubletap 
//                    { 
//                        if(ev.type == "press")
//                            {
//                               console.log(ev.type);
////                                alert("press");
////                                goFullscreen();
////                                changeColor("next");
//                            }
//                        if(ev.type == "doubletap")
//                            {
//                                if (currentCamera == 3)
//                                    animateLid();
//                                else if (currentCamera == 2)
//                                    animateDoors(); 
//                                else if (currentCamera == 6)
//                                {
//                                    if (wheelInitPos)
//                                    {
//                                        animateWheel({wheel: THREE.Math.degToRad(30)});
//                                        wheelInitPos = false;
//                                    }
//                                    else
//                                    {
//                                        animateWheel({wheel: THREE.Math.degToRad(-30)});
//                                        wheelInitPos = true;
//                                    }
//                                }
//                                 
//                            }
//                        if(ev.type == "singletap")
//                            {
//                                console.log(ev.type);
////                                mouse.x = ( ev.center.x / window.innerWidth ) * 2 - 1;
////                                mouse.y = - ( ev.center.y / window.innerHeight ) * 2 + 1;
////
////                                raycaster.setFromCamera( mouse, camera );
////                                
////                                //alert("doubletap");
////                                var intersects = raycaster.intersectObjects( scene.children, true );
////                                if (intersects[0])
////                                    {
////                                        var nameParent = intersects[0].object.parent.name;
////                                        console.log(nameParent);
////                                        if(nameParent == 'frontdoor' || nameParent == 'frontdoorCo' || nameParent == 'reardoor' || nameParent == 'reardoorCo')
////                                        {
////                                            animateDoor(intersects[0].object.parent);
////                                        }
////                                        else if(nameParent == 'lid' )
////                                        {
////                                            animateLid(intersects[0].object.parent);
////                                        }
////                                        else if (nameParent == 'paint')
////                                            changeColor("next");
//////                                        console.log(nameParent);
////                                    }
//                            }
//                    });
            
                
                _this.model = new THREE.Group();
//                _this.model.scale.set(1,1,1);
//                _this.model.position.set(230,67,0);
//                _this.model.rotation.y = THREE.Math.degToRad(-30);
                
//                _this.scene.add( _this.model );
                
                
                // 2D Hotspots (sprites as HMD)
                
                // Todo: Not as Texture ... create Text dynamically!

                _this.hotspot_color = new THREE.Sprite( new THREE.SpriteMaterial( {  } ) ); //map: getTexture( "color" )
                _this.hotspot_wheel = new THREE.Sprite( new THREE.SpriteMaterial( {  } ) ); //map: getTexture( "wheel" )
//                hotspot_spin = new THREE.Sprite( new THREE.SpriteMaterial( { map: getTexture( "spin" ) } ) );
                
                _this.hotspot_color.name = 'color';
                _this.hotspot_wheel.name = 'wheel';
//                hotspot_spin.name = 'spin';
////
////                // 3D Hotspots (sprites in 3D world)
////                
                _this.hotspots = new THREE.Group();
                _this.hotspots.visible = true;
//                                
                var matSpot = new THREE.SpriteMaterial(); //map: mapSpot
                matSpot.opacity = 0;
////                
                var colorSpot = new THREE.Sprite( matSpot );
                colorSpot.name = 'color';
                // x = rot, y = grün, z = blau (AxisHelper) 
                colorSpot.position.set(-200,10,-150); 
//                console.log(trunkSpot);
                var wheelSpot = colorSpot.clone();
                wheelSpot.name = 'wheel';
                // x = rot, y = grün, z = blau (AxisHelper) 
                wheelSpot.position.set(200,10,120); 
////          //model.position.set(-156,-106,0);
//                var interactSpot = colorSpot.clone();
//                interactSpot.name = 'spin';
//                // x = rot, y = grün, z = blau (AxisHelper) 
//                interactSpot.position.set(400,40,-160); 
//                
                _this.hotspots.add( colorSpot );
                _this.hotspots.add( wheelSpot );
//                hotspots.add( interactSpot );
//
                _this.sceneSprites.add(_this.hotspots);
                
                // simple bounding boxes for hotspots ( occlusion culling )

                _this.objCube = new THREE.Object3D();
                // x = rot, y = grün, z = blau (AxisHelper) 
                var cube1 = new THREE.Mesh( new THREE.BoxGeometry( 200, 80, 180 ), new THREE.MeshBasicMaterial( {color: 0xff0000} ) );
                cube1.position.x = -146;
                cube1.position.y = -76;
                var cube2 = new THREE.Mesh( new THREE.BoxGeometry( 240, 110, 160 ), new THREE.MeshBasicMaterial( {color: 0xfff500} ) );
                cube2.position.x = 74;
                cube2.position.y = -76;
                var cube3 = new THREE.Mesh( new THREE.BoxGeometry( 160, 95, 130 ), new THREE.MeshBasicMaterial( {color: 0x00ffff} ) );
                cube3.position.x = -116;
                cube3.position.y = -56;
                cube3.rotation.z = THREE.Math.degToRad(30);
                var cube4 = new THREE.Mesh( new THREE.BoxGeometry( 210, 120, 130 ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
                cube4.position.x = 34;
                cube4.position.y = -36;
                
                _this.objCube.add( cube1 );
                _this.objCube.add( cube2 );
                _this.objCube.add( cube3 );
                _this.objCube.add( cube4 );
//                
                _this.objCube.visible = false;
                _this.objCube.position.z = 20;
                _this.objCube.position.y = 140;
                _this.objCube.rotation.y = THREE.Math.degToRad(-90);
                _this.objCube.scale.y = 1.1;
                _this.objCube.scale.x = 1.1;
                _this.objCube.scale.z = 1.2;
////                console.log('---------------------------------');
////                console.log(objCube);
                _this.model.add( _this.objCube );
                
                // RTT

//                cubeCamera = new THREE.CubeCamera( 1, 2500, 1024 );
//                //cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
//                cubeCamera.doubleSided = true;
//                cubeCamera.position.y = 150;
////                    cubeCamera.rotation.y = Math.radians(180);
////                    cubeCamera.position.x *= -1;
//                scene.add( cubeCamera );
//                cubeTarget = cubeCamera.renderTarget.texture;
//                cubeTarget.minFilter = THREE.LinearMipMapLinearFilter;
                
//                cubeTarget = loaderTextures.load('textures/map.jpg');
                
                
                
                // materials

                createMaterialLibrary();
                
//                _this.scene.background = createColorTexture('#37547A');
                
//                _this.scene.overrideMaterial = _this.matSimple;
                
				// models
                //x = rot, y = grün, z = blau (AxisHelper)
                var axh = new THREE.AxesHelper( 500 )
                axh.position.set(280,1,0);
//				_this.scene.add( axh );
                
                var gridHelper = new THREE.GridHelper( 2000, 20 );
				gridHelper.position.y = 0;
//				_this.scene.add( gridHelper );

                
                

//                boundbox = new THREE.BoxHelper( model, 0xffff00 );
//                scene.add( boundbox );

                // wheels

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
                
//                 pivotWheelRL.position.x -= 84;
//                    pivotWheelRL.position.y = 37;
//                    pivotWheelRL.position.z = 140; //-235
//                    model.add( pivotWheelRL );
//
//                    pivotWheelRR.position.x = 84;
//                    pivotWheelRR.position.y = 37;
//                    pivotWheelRR.position.z = 140;
//                    model.add( pivotWheelRR );
//
//                    pivotWheelFL.position.x -= 82;
//                    pivotWheelFL.position.y += 37;
//                    pivotWheelFL.position.z += -139;
//                    pivotWheelFL.rotation.y = Math.radians(30);
//                    model.add( pivotWheelFL );
//
//                    pivotWheelFR.position.x += 82;
//                    pivotWheelFR.position.y += 37;
//                    pivotWheelFR.position.z += -139;
//                    pivotWheelFR.rotation.y = Math.radians(30);
//                    model.add( pivotWheelFR );
                // x = rot, y = grün, z = blau (AxisHelper)
//                _this.pivotWheelRL.position.x -= 84;
//                _this.pivotWheelRL.position.y = 37;
//                _this.pivotWheelRL.position.z = 140; //-235
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
               

				// lights
                
//                _this.ambient = new THREE.AmbientLight( 0x111111 ); //0x444444
//                _this.ambient.intensity = -10;
//                _this.scene.add( _this.ambient );
                
//                _this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xff0000, 1 );
//				_this.scene.add( _this.hemiLight );
               
                var ballMat = new THREE.MeshStandardMaterial( {
					color: 0xff0000,
					roughness: 0.5,
					metalness: 1.0
				});
//                
                var ballGeometry = new THREE.SphereGeometry( 12, 32, 32 );
				var ballMesh = new THREE.Mesh( ballGeometry, ballMat );
				
                
                
//                directionalLight = new THREE.DirectionalLight( 0xffffff, 2 ); //, 3000, 2
////                directionalLight.position.set( 0, 120, -300 );
//                directionalLight.position.set( -200, 420, 200 );
//                
//                // x = rot, y = grün, z = blau (AxisHelper)
////                directionalLight.position.set(-600, 600 , -400);
//                
////                directionalLight.target.position.set(0, 0, 0);
//                
//                directionalLight.castShadow = true;
//                directionalLight.shadow.camera.left = -800;
//                directionalLight.shadow.camera.right = 800;
//                directionalLight.shadow.camera.top = 800;
//                directionalLight.shadow.camera.bottom = -800;
//                directionalLight.shadow.camera.near = 10;
//                directionalLight.shadow.camera.far = 4000;
//                directionalLight.shadow.radius = 1;
//                directionalLight.shadow.bias = 0.0005;
//                directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
//                directionalLight.shadow.mapSize.height = SHADOW_MAP_WIDTH;
//                scene.add( directionalLight );
                
//                console.log(directionalLight);
                
//                dirLight = new THREE.DirectionalLight( 0xffffff, 1 ); // Hills 0xffffff // Field 0xffffda 
                _this.dirLight = new THREE.DirectionalLight( 0xffffff, 2 );
//                dirLight.position.set( -500, 650, 400 );
//                _this.dirLight.add( ballMesh );
                // x = rot, y = grün, z = blau (AxisHelper)
//                 dirLight.position.set( 356, 357, 180 ); // Venecia
//                dirLight.position.set( -670, 380, -530 ); // Hills
//                dirLight.position.set( 260, 120, -530 ); // Field
//                dirLight.position.set( -200, 420, 200 ); // Hall !!!!!!
//                dirLight.position.set( 220, 352, -900 ); // Coast
//                dirLight.position.set( 260, 50, -800 );
//                dirLight.position.set( 1055, 1002, -1530 ); //add dirLight to camera and test this (cool!)
                
//                dirLight.position.set( -1180, 876, -217 );
//                dirLight.position.set( -350, 368, -967 );
                
//                dirLight.position.set( 356, 357, 180 );
//                dirLight.position.set( -129, 920, 3 );
//                _this.dirLight.position.set( -280, 230, 30 );
                _this.dirLight.position.set( 47, 400, 0 ); //135, 567, -41  //47, 1000, 444
                console.log(_this.dirLight);

//                dirLight.position.set( 100, 250, 300 );  // dynamic light 
//                dirLight.position.set( 207, 256, 77 );
                //346.8099498897042, y: 448.23159225638955, z: 96.14389182399361
//                dirLight.intensity = 1;
//                if (!check) 
//                    dirLight.castShadow = true;
//                else
//                    dirLight.castShadow = true;
                _this.dirLight.castShadow = _this._castShadow;
                _this.dirLight.shadow.camera.left = -800;
                _this.dirLight.shadow.camera.right = 800;
                _this.dirLight.shadow.camera.top = 800;
                _this.dirLight.shadow.camera.bottom = -800;
                _this.dirLight.shadow.camera.near = 10;
                _this.dirLight.shadow.camera.far = 4000;
                _this.dirLight.shadow.radius = 1;
//                _this.dirLight.shadow.bias = 0.001;
                _this.dirLight.shadow.mapSize.width = _this.SHADOW_MAP_WIDTH;
                _this.dirLight.shadow.mapSize.height = _this.SHADOW_MAP_HEIGHT;
                
                
//                console.log("dirLight");
//                console.log(dirLight);
//                scene.add( dirLight );
//                dirLight.add( ballMesh );
//                scene.add( dirLight );
                _this.dirLight.visible = _this._light;
//                _this.scene.add( _this.dirLight.target );
                _this.scene.add( _this.dirLight ); // dynamic shadow map effect (cool!)  if (!_this.check) 
                
                
//                _this.directionalLight = new THREE.DirectionalLight( 0xffffff, 2 ); //, 3000, 2
//                _this.directionalLight.castShadow = false;
//                _this.directionalLight.position.set( 260, 100, -800 );
//                scene.add( directionalLight );
                
//                var rectLight = new THREE.RectAreaLight( 0xffffff, 3, 140, 400 );
//				rectLight.position.set( -100, 1000, 200 );
//                rectLight.rotation.x = THREE.Math.degToRad(90);
//                rectLight.rotation.z = THREE.Math.degToRad(90);
      
                
//				scene.add( rectLight );
                
//                rectLight2 = new THREE.RectAreaLight( 0x112229, 200000, 1000, 1000 );
//				rectLight2.position.set( 0, 300, 0 );
////                rectLight.rotation.set( 1, 1, 0 );
//                rectLight2.rotation.x = THREE.Math.degToRad(90);
//                rectLight2.rotation.z = THREE.Math.degToRad(90);
                
//                model.add( rectLight2 );
                
//                rectLightHelper = new THREE.RectAreaLightHelper( rectLight2 );
//				scene.add( rectLightHelper );
                
//                hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
//				hemiLight.color.setHSL(.5, .5, 0.7 );
//				hemiLight.groundColor.setHSL( 1, 1, .5 );
//				hemiLight.position.set( 0, 0, 0 );
//				scene.add( hemiLight );

//				hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
//				scene.add( hemiLightHelper );
//                 155, 102, -530 );
                
                
                //addLenseFlare( 0.55, 0.9, 0.5 );

//                function addLenseFlare( h, s, l) {
//
////                    var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
////                    light.color.setHSL( h, s, l );
////                    light.position.set( x, y, z );
////                    dirLight.add( light );
//
//                    
//                    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 700, 0, dirLight.color ) );
//                    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.6 ) );
//                    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 0.7 ) );
//                    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 120, 0.9 ) );
//                    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 1 ) );
////                    dirLight.add( lensflare );
//
//                }
                
                // SKYDOME

//				var vertexShader = document.getElementById( 'vertexShader' ).textContent;
//				var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
//				uniforms = {
//					topColor:    { value: new THREE.Color( 0xd6dbe0 ) }, //b8cad3
//					bottomColor: { value: new THREE.Color( 0xffffff ) },// e0e3ea
//					offset:      { value: -33 },
//					exponent:    { value: 0.2 }
//				};
                
//                var color = new THREE.Color( 0x2e2e30 ); //0x5e5546
                


//                scene.background = new THREE.Color().setHSL( 0, 0, 1 );
//				scene.fog = new THREE.Fog( 0x2e2e30, 1900, 4100 );
//				scene.fog.color.copy( color );

                
//				var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
//				var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
//
//				var sky = new THREE.Mesh( skyGeo, skyMat );
//                sky.position.set(0,0,0);
				
                
                
                
                _this.positions = { x: _this.camera.position.x, y: _this.camera.position.y, z: _this.camera.position.z, x2: _this.controls.target.x, y2: _this.controls.target.y, z2: _this.controls.target.z, fov: _this.camera.fov, wheel: _this.pivotWheelFL.rotation.y};
                
//                var helper = new THREE.CameraHelper( dirLight.shadow.camera );
//                scene.add( helper );
//                
                
//                pointLight = new THREE.PointLight( 0xff0000, 1, 1000 );
//                pointLight.position.set( 350, 150, 50 );
//                camera.add( pointLight );
                
                // INTERIOR

               
                var path = "textures/model/interior/" + _this.trimTotal[_this.trimPos - 1] + "/";
				var urls = [ path + "pos-x_" + _this.textureformat + '.ktx', path + "neg-x_"  + _this.textureformat + '.ktx',
                             path + "pos-y_" + _this.textureformat + '.ktx', path + "neg-y_" + _this.textureformat + '.ktx',
                             path + "pos-z_" + _this.textureformat + '.ktx', path + "neg-z_" + _this.textureformat + '.ktx' ];

                var textures = [];
                
                


                _this.interior = new THREE.Mesh( new THREE.BoxGeometry( 160, 160, 160   ), _this.materialArray );
                _this.interior.scale.x = -1;
//                _this.interior.scale.y = -1;
//                _this.interior.rotation.y = THREE.Math.degToRad(90);
//                _this.interior.position.y = 110;
                _this.interior.position.set( -38.5, 110, 20);
//                _this.interior.position.x = 180;
//                interior.position.x = 260;
//                interior.position.z = -260;
                _this.interior.visible = false;
				_this.scene.add( _this.interior );
//                render();
//                interior.visible = false;

				// loading
                
                var groundMat = new THREE.MeshBasicMaterial   ( { 
                        color: 0, 
//                        depthWrite: false,
//                        depthTest: false,
                        transparent: true,
                        opacity: 1,
                        alphaMap: _this.loaderc.load('textures/model/exterior/groundshadow_' + _this.textureformat + '.ktx')
//                        alphaMap: _this.loaderTextures.load('textures/model/groundshadow.png')
                    } );
                
                loadGLTF('blob');
                
                  // Load one GLB file including all meshes
                
                loadGLTF('exterior');
                    
                  // Load default exterior options
                loadGLTF('q8u');
//                loadGLTF('q6x');
                loadGLTF('j56_front');
                loadGLTF('j56_rear');
//                loadGLTF('j57_front');
//                loadGLTF('j57_rear');


//                  loadGLTF('seat');

                loadGLTF('interior');
                
                
                  // Load individual GLB files
                
//                loadGLTF('paint');
//                loadGLTF('paint2');
//
//                
//                loadGLTF('j56_front');
//                loadGLTF('j56_rear');
////                
//                loadGLTF('front');
//                loadGLTF('side');
//                loadGLTF('rear');
//                loadGLTF('door');
//                loadGLTF('trunk');
//                
//                loadGLTF('frontlamp');
//                loadGLTF('rearlamp');
//
//                loadGLTF('black');

//                loadGLTF('windowpane');
               
                
                

                _this.manager.onProgress = function (item, loaded, total) 
                {
//                    console.log(item, loaded, total);
                    var percentage = Math.round((loaded / total) * 100); 
//                    loadingBar.style.width=percentage + "%";
//                    loadingText.textContent=percentage + "%";
                    if ( item.lengthComputable ) 
                    {
                        var percentComplete = item.loaded / item.total * 100;
//                        console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    }
                };
                _this.manager.onLoad = function () {
                        //showhide();
//                        console.log('all items loaded');
                        if (_this.initialise === false)
                        {
                            // Let's try to avoid 
//                            document.ontouchmove = function(event){
//                                event.preventDefault();
//                            }
                            
                            
                            
                            if ('addEventListener' in document) 
                            {
                                document.addEventListener('DOMContentLoaded', function() {
                                FastClick.attach(document.body);
                                }, false);
                            }
                            
//                            engine2d.style.display = "block";
//                            trunk2d.style.display = "block";
                            
//                            addMirrorPlane();

                            var groundGeo = new THREE.PlaneGeometry( 362, 680 );
// x = rot, y = grün, z = blau (AxisHelper)
                            _this.groundshadow = new THREE.Mesh( groundGeo, groundMat );
//                            groundshadow.rotation.x = THREE.Math.degToRad(-90);
                            _this.groundshadow.rotation.x = THREE.Math.degToRad(-90);
                            _this.groundshadow.rotation.z = THREE.Math.degToRad(-90);
                            _this.groundshadow.position.x = 270;
                            _this.groundshadow.position.y = 21;
                            _this.groundshadow.position.z = 4;
//                           groundshadow.position.y = 30;
                            _this.groundshadow.scale.y = .70;
                            _this.groundshadow.scale.x = .75;
//                            pivotWheelFL.position.x += 183; // vor zurück
//                            pivotWheelFL.position.y += 87; // hoch runter
//                            pivotWheelFL.position.z += 74.5; // links rechts
                            
//                            console.log(  _this.groundshadow );
                            
                            var planeGeometry = new THREE.PlaneGeometry( 4000, 4000 );
                            planeGeometry.rotateX( - Math.PI / 2 );

                            var planeMaterial = new THREE.ShadowMaterial();
                            
                            
                            _this.plane = new THREE.Mesh( planeGeometry, planeMaterial );
                            _this.plane.position.y = 22;
                            _this.plane.position.x = 0;
                            _this.plane.receiveShadow = true;
                            _this.plane.material.opacity = 0.35; //.35
                            
//                            _this.model.visible = false;
//                            console.log(  _this.plane );
//                            dirLight.target = plane;
//                            directionalLight.target = plane;
//                            console.log(  blob.children[0].material.map);
//                            if (environment == 'studio')
//                                {
//                                    alert('killl env');
//                                    blob.children[0].material.map.dispose();
//                                    blob.children[0].material.map = null;
//                                    blob.children[0].material.needsUpdate = true; 
//                                }

    //                        changeReflections();
//                            cubeCamera.updateCubeMap( renderer, scene );

//                            if (boundbox) boundbox.update (); // FPS Killer if updated each frame
    //                        cube.width = boundbox.width;
    //                        cube.height = boundbox.height;
//                            renderer.shadowMap.needsUpdate = false;
                            _this.renderer.shadowMap.needsUpdate = true;
//                            renderer.shadowMap.autoUpdate = true;
//                            render();
//                            blob.visible = false;
//                            scene.remove(blob);
                            _this.initialise = true;
                            
//                            _this.stats = new Stats();
//            				_this.container.appendChild( _this.stats.dom );
//                            _this.stats.dom.style.top = '0px';
//                            _this.stats.dom.style.right = '0px';
                            
                            window.addEventListener('deviceorientation', setOrientationControls, true);
//                            window.addEventListener('dblclick', goFullscreen, false);
//                           
                            // Build & Test
//                            var tester = document.getElementById('logo');
//                            tester.addEventListener('click', toggleGUI, false);
                            
                             
                            
                            // 2D <-> 3D
//                            var toggle = document.getElementById('toggle');
//                            toggle.addEventListener('change', toggleDimension, false);
                            
//                            function toggleDimension() {
//                                
//                                if (_this.check) 
//                                {
//                                    if (_this.screenfull.enabled && !_this.screenfull.isFullscreen) 
//                                        {
//                                           _this.screenfull.request(); 
//                                        }   
////                                    else
////                                        {
////                                            screenfull.exit();  //if (worientation != "landscape")   
////                                        }  
//                                }
////                                if (!toggle.checked)
////                                {
////                                    controls.enabled = true;
////                                    document.addEventListener("mousemove", moveHandler, false);
////                                    document.addEventListener("mousedown", touchdownHandler, false);
////                                    document.addEventListener("mouseup", touchupHandler, false);
////                                    document.addEventListener("keydown",keyDownHandler, false);
////                                    
////                                }
////                                else
////                                {
////                                    controls.enabled = false;
////                                    document.removeEventListener("mousemove", moveHandler);
////                                    document.removeEventListener("mousedown", touchdownHandler);
////                                    document.removeEventListener("mouseup", touchupHandler);
////                                    document.removeEventListener("keydown",keyDownHandler); 
////                                }
//
//                            }

                            document.addEventListener('contextmenu', onContextMenu, false );
                            
                            document.addEventListener("mousemove", moveHandler, false);
                            document.addEventListener("mousedown", touchdownHandler, false);
                            document.addEventListener("mouseup", touchupHandler, false);
                            document.addEventListener("keydown",keyDownHandler, false);
                            
//                            document.addEventListener("keyup",keyUpHandler, false);

                            
//                            model.add(gtrunkLid);

//                            scene.add( sky );
                            
//                            assignMaterials();
                            
                            
                             
                            _this.aa = true;
                            
                            window.addEventListener( 'resize', resizeTimer, false );
//                            controls.enabled = true;
//                            document.getElementById("loader").style.zIndex = "-1";
                            
//                            changeColorExt(1);
                            
                            
                            
//                            var timerAssign = setTimeout(function() {
//                                    assignMaterials();
//                                    render();
//                            }, 100);
                            
                            animate();
                            
//                            buildGUI();
                            
                            _this._loadingDone('LoadingCompleted');

                              changeColor(_this.paintPos);
                              changeCaliperColor(2);
                              _this.model.add( _this.groundshadow );
                              _this.model.add( _this.plane );
                              _this.scene.add( _this.model );
//                            console.log(_this.model);
//                            _this.model.position.set(-300,0,0);
                              resizeTimer();

                            
//                            for (var i = 0; i < 6; i++)
//                            { 
//                                textures[i] = _this.loaderc.load( urls[i] );
//                                _this.materialArray.push( new THREE.MeshBasicMaterial({map: textures[i], transparent:true, side:1}));
//            //                    _this.renderer.setTexture2D(textures[i], 0);
//                            }
                            

                            
                            
                        }
                    else
                        render('Init2');



                };
                _this.manager.onError = function () {
                    console.log('there has been an error');
                };
 
                }

                function toggleGUI() {
                    if(_this.container.contains( _this.stats.dom ))
                    {
                        _this.container.removeChild( _this.stats.dom )
                        _this.gui.domElement.style.display = 'none';
                    }
                     else
                     {
                        _this.container.appendChild( _this.stats.dom )
                        _this.gui.domElement.style.display = '';
                     }

                 }
                
                function onContextMenu( event ) {

		            event.preventDefault();

//                    _this.aa = true;
//                    alert('onContextMenu');

            	}

                function buildGUI( ) {

                    var folder;
                
                    var data = {
                        color: _this.physicalMaterial.color.getHex()
                    };
                    
                    folder = _this.gui.addFolder( 'Material' );
                    
                    _this.colorGUI = folder.addColor(data, 'color' ).onChange( handleColorChange( _this.physicalMaterial.color ) );
                    
//                    folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
	
     
//                    folder.addColor(_this.physicalMaterial, 'color');
                    
                    folder.add( _this.physicalMaterial, 'roughness', 0, 1 ).step( 0.01 ).onChange( function ( value ) {
                        render('GUI');
                    } ).listen();
                    folder.add( _this.physicalMaterial, 'metalness', 0, 1 ).step( 0.01 ).onChange( function ( value ) {
                        render('GUI');
                    } ).listen();
                    folder.add( _this.physicalMaterial, 'clearCoat', 0, 1 ).step( 0.1 ).onChange( function ( value ) {
                        render('GUI');
                    } ).listen();
                    folder.add( _this.physicalMaterial, 'clearCoatRoughness', 0, 1 ).step( 0.1 ).onChange( function ( value ) {
                        render('GUI');
                    } ).listen();
                    folder.add( _this.physicalMaterial, 'reflectivity', 0, 1 ).onChange( function ( value ) {
                        render('GUI');
                    } ).listen();
                    folder.add( _this.physicalMaterial, 'envMapIntensity', 0, 1 ).listen().onChange( function ( value ) {
                        render('GUI');
                    } ).listen();
 
                    folder = _this.gui.addFolder( 'Light' );
                    
                    folder.add( _this.dirLight, 'visible' ).onChange( function ( value ) {
                        render('GUI');
                    } );
                    
                    folder.add( _this.dirLight, 'castShadow' ).onChange( function ( value ) {
//                        dirLight.castShadow = value;
                        render('GUI');
                    } );

                    var lightX = folder.add( _this.dirLight.position, 'x' ).min(-2000).max(2000).step(1).listen();
                    var lightY = folder.add( _this.dirLight.position, 'y' ).min(0).max(1000).step(1).listen();
                    var lightZ = folder.add( _this.dirLight.position, 'z' ).min(-2000).max(2000).step(1).listen();
                    
                    lightX.onChange(function(value) 
                    {   _this.renderer.shadowMap.needsUpdate = true;render('GUI');  });
                    lightY.onChange(function(value) 
                    {   _this.renderer.shadowMap.needsUpdate = true;render('GUI');  });
                    lightZ.onChange(function(value) 
                    {   _this.renderer.shadowMap.needsUpdate = true;render('GUI');  });
                    
//                    folder = gui.addFolder( 'Shadow' );
//
//                    folder.add( renderer.shadowMap, 'enabled' ).onChange( function ( value ) {
//                        render('GUI');
//                    } );

                    
                    folder = _this.gui.addFolder( 'Model' );
                    
                    folder.add( _this.paramsModel, 'groundshadow' ).onChange( function ( value ) {
                    _this.groundshadow.visible = value;
                    render('GUI');
                    } );
                    folder.add(_this.paramsModel, 'rotationY', -180, 180).onChange( function ( value ) {
                        _this.model.rotation.y = THREE.Math.degToRad(value);
                        _this.aa = false;
                        _this.renderer.shadowMap.needsUpdate = true;
                        render('GUI');
                    } );
                    folder.add(_this.paramsModel, 'wheelPositionY', -30, 30, 1 ).onChange( function ( value ) {
                        _this.pivotWheelFL.rotation.y = _this.pivotWheelFR.rotation.y = THREE.Math.degToRad(value);
//                        aa = false;
                        _this.renderer.shadowMap.needsUpdate = true;render('GUI');
                    } );
                    
                    folder = _this.gui.addFolder('Camera');
                    folder.add(_this.camera.rotation, 'x', -1000, 1000, 0.01).onChange( function ( value ) {
//					camera.rotation.x = value;
                    render('GUI');
				    } ).listen();
                  
                    
                    _this.gui.open(); 
                    
                    _this.gui.domElement.style.display = 'none';

                }
                
//                function updateGUI ( ) {
//                // Iterate over all controllers
//                  for (var i in gui.__controllers) {
////                    gui.__controllers[i].updateDisplay();
//                      console.log(gui.__controllers[i])
//                  }
//                }
                
                function getMaterial ( mat ) {

                    return this[mat];
                    
                }
    
                function handleColorChange ( color ) {

                    return function ( value ){

                        if (typeof value === "string") {

                            value = value.replace('#', '0x');

                        }
                        
                        color.setHex( value );
                        console.log(color);
//                        console.log(value);

                        // For better gamma support (bug in three.js?) we use images here to change the HEX color values     
                        if (_this.physicalMaterial == _this.matPaint)
                        {
                            _this.physicalMaterial.map = createColorTexture('#' + color.getHexString());
                            // To not mix color with texture we reset to white color
                            color.setHex( 0xffffff );  
                        }
                        
//                        if (paramsEnv.laquer)
//                            matBlob.color.setHex( value );
                        render('GUI');
                    };
                    

                }


                
                
//                matChanger();
                              
                

			function assignMaterials2(model) {
                
            }
    
            function assignMaterials3(model) {
                for (var i = 0; i < model.children.length; i++) 
                    model.children[i].material = _this.matPaint;
            }
            
            function assignMaterials(model) {

                    var meshes = [];
                
//                    getGroups(model);
                    
//                    function getGroups(obj)
//                    {
//                        for (var k in model)
//                        {
//                            console.log(obj.children[k].name);
//                            console.log(obj.children[k]);
//                            if(model.children[k].type == "Mesh")
//                            {
//                                console.log(model.name);
                           

//                                    console.log(obj.children[k].children[i].material);
//                                    if (obj.children[k].children[i].type == "Group")
//                                    {
//                                        getGroups(obj.children[k].children[i]);
//                                    }
                                    if (model.name == 'seat' )
                                    {
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
                                    }
                                    else if (model.name == 'center_console' )
                                    {
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
                                    }
                                    else if (model.name == 'roof_ground' )
                                    {
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
                                        
                                    }
                                    else if (model.name == 'cockpit' )
                                    {
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
                                    }
                                    else if (model.name == 'door_inside' )
                                    {
                                        for (var i = 0; i < model.children.length; i++)
                                            {
                                                model.children[i].material = _this.matLeather;
//                                               if (model.children[i].material != _this.mat)
//                                                model.children[i].material.shadowSide = 2;
                                            }
                                            
                                        model.children[1].material = _this.matBlack;
                                        model.children[3].material = _this.matDecor;
                                        model.children[5].material = _this.matDecor;
                                        model.children[6].material = _this.matPlasticDark;
                                        model.children[7].material = _this.matLogoWhite;
                                    }
                                    else if (model.name == 'steering' )
                                    {
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
                                    }
                                    else if (model.name == 'paint2' )
                                    {
                                        model.children[1].material = _this.matPaint;
                                        model.children[0].material = _this.matPlasticDark;
                                    }
                                    else if (model.name == 'paint' )
                                    {
                                        for (var i = 0; i < model.children.length; i++) 
                                            model.children[i].material = _this.matPaint;
                                    }
                                    else if (model.name == 'trunk' )
                                    { 
                                        model.children[1].material = _this.matPrimer;
                                        model.children[2].material = _this.matPaint;
                                        model.children[0].material = _this.matAlu;
                                        
                                        model.children[3].material = _this.matWindowPrivat;
                                        model.children[4].material = _this.matBlack;
                                    }
                                    else if (model.name == 'black' )
                                    {
                                        model.children[0].material = _this.matBlack;
                                    }
                                    else if (model.name == 'front' )
                                    { 
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
                                    }
                                    else if (model.name == 'frontlamp' )
                                    {
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

                                    }
                                    else if (model.name == 'rearlamp')
                                    {
                                        model.children[0].material = _this.matPlasticGloss;
                                        model.children[1].material = _this.matGlas;
                                        model.children[2].material = _this.matGlasRed;
                                        model.children[3].material = _this.matGlasRed;
                                        model.children[4].material = _this.matAluDark;
                                        model.children[5].material = _this.matBlack;
                                    }
                                    else if (model.name == 'rear' )
                                    {
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
                                        
                                        
                                    }
                                    else if (model.name == 'side' )
                                    {
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
                                    }
                                    else if (model.name == 'j56_front' || model.name == 'j57_front' || model.name == 'j57_rear' )
                                    {
                                        model.children[0].material = _this.matAlu;
                                        model.children[1].material = _this.matCaliper;
                                        model.children[2].material = _this.matCaliperLogo;
                                        if (model.name == 'j57_front') 
                                            model.children[3].material = _this.matDisk2;
                                        else
                                            model.children[3].material = _this.matDisk; 
                                        model.children[4].material = _this.matAluDark;
                                        model.children[5].material = _this.matAlu;
                                    }
                                    else if (model.name == 'j56_rear')
                                    {
                                        model.children[0].material = _this.matAlu;
                                        model.children[1].material = _this.matAlu;
                                        model.children[2].material = _this.matCaliper;
                                        model.children[3].material = _this.matCaliperLogo;
                                        model.children[4].material = _this.matDisk;
                                        model.children[5].material = _this.matAluDark;
                                        model.children[6].material = _this.matAlu;
                                    }
                                    else if (model.name == 'top' )
                                    {
                                        for (var i = 0; i < model.children.length; i++)
                                            model.children[i].material = _this.matPrimer;
                                        model.children[2].material = _this.matPaint;
                                        model.children[3].position.y = -.5;
                                        
                                    }
                                    else if (model.name == 'door' )
                                    {
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
                                    }
                                    else if (model.name == 'windowpane' )
                                    {
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
                                    else if (model.name == 'q6x')
                                    { 
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
                                    }           
                                    else if (model.name == 'q8u')
                                    {
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

//                                }
//                    }
                
            }
          function resizeTimer() 
            {
//              _this.aa = false; 
//              setTimeout(function(){ resizeFrame() }, 350);
                if(_this.timerResize !== null) {
                    clearTimeout(_this.timerResize);        
                }
                _this.timerResize = setTimeout(function() {
                        resizeFrame()
//                        _this.aa = true;
//                        render('Resize_timeout');
                }, 350);
            }

//            function addMirrorPlane() {
//
//				// reflectors/mirrors
//				var geometry = new THREE.CircleBufferGeometry( 5000, 64 );
//				var groundMirror = new THREE.Reflector( geometry, {
//					clipBias: 0.003,
//					textureWidth: 1024,
//					textureHeight: 1024,
//					color: 0x7F7F7F,
//					recursion: 1
//				} );
//				groundMirror.position.y = 29;
//				groundMirror.rotateX( - Math.PI / 2 );
////                groundMirror.opacity = 0.2;
//				_this.scene.add( groundMirror );
//                
////				var geometry = new THREE.PlaneBufferGeometry( 50, 400 );
////				var verticalMirror = new THREE.Reflector( geometry, {
////					clipBias: 0.003,
////					textureWidth: _this.SCREEN_WIDTH * window.devicePixelRatio,
////					textureHeight: _this.SCREEN_HEIGHT * window.devicePixelRatio,
////					color: 0x889999,
////					recursion: 1
////				} );
////				verticalMirror.position.y = 50;
////				verticalMirror.position.z = - 350;
////				_this.scene.add( verticalMirror );
//
//            }


//            updateCube = function() {
            function updateCube() {

//                alert(trim[currentTrim]);
//                spinner.classList.remove('hide');
                
                var path = "textures/interior/" + trim[currentTrim] + "/" + environment[currentEnvironment] + "/" + imgsize + "/";
				var urls = [ path + "pos-x" + imgformat, path + "neg-x"  + imgformat,
                             path + "pos-y" + imgformat, path + "neg-y" + imgformat,
                             path + "pos-z" + imgformat, path + "neg-z" + imgformat ];
                var counter = 6;
                for (var i = 0; i < 6; i++)
                    {
                        materialArray[i].map.dispose();
                        materialArray[i].map = loaderTextures.load( urls[i],function ( obj ) //json or gltf
                        { 
                            counter--;
//                            if(counter)
//                            spinner.classList.add('hide');
                        }); 
                    }


            }

            

            function goFreestyle() {
                
                onOrientationChance();
//                if (worientation != "landscape")
//                {
//
//                    if (controls.enabled)
//                        {
//                           controls.enabled = false;
//                           showUI(); 
//                        }
//                    else
//                        {
//                            controls.enabled = true;
//                            hideUI();
//                        }  
//                }
            }

//            function goFullscreen() {
//
//                
//                if (screenfull.enabled && !screenfull.isFullscreen) 
//                    {
//                       screenfull.request(); 
//                    }   
//                else
//                    {
//                        screenfull.exit();  //if (worientation != "landscape")   
//                    }
//                   
//
//            }
    


            function startControl(e) 
            {
                console.log(e); //'startControl ' + 
                if(_this.timerScroll !== null) {
                    clearTimeout(_this.timerScroll);        
                }
                _this.rotateDir = undefined;
//                renderer.shadowMap.type = 0;
//                matPaint.needsUpdate = true;
//                matAlloy.needsUpdate = true;
//                plane.material.needsUpdate = true;
//                console.log(matPaint.needsUpdate);
//                aa = false;
                
//                if (window.devicePixelRatio >= 2)
//                        composer.setSize( SCREEN_WIDTH*2, SCREEN_HEIGHT*2 );
//                    else
//                       composer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT ); 
                _this.controls.removeEventListener('enddamping', endDamping);
                _this.mouseDown = true;
//                renderer.shadowMap.enabled = false;
            }
            function moveControl(e) 
            {
                 _this.aa = false;
            }
            function endControl() 
            {
//                if (worientation === "landscape")
//                {
//                    resize();
//                }

                if (_this.controls.enableDamping)
                {
                    _this.controls.addEventListener('enddamping', endDamping);
                }
                else
                    _this.mouseDown = false; 
            }

            function startScroll(e) 
            {
                if(_this.timerScroll !== null) {
                    clearTimeout(_this.timerScroll);        
                }
                _this.controls.removeEventListener('enddamping', endDamping);
                _this.mouseDown = true;
                _this.aa = false;
            }
            function endScroll(  ) 
            {              
               _this.timerScroll = setTimeout(function() {
                        _this.mouseDown = false;
                        _this.aa = true;
                        render('endScroll');
                }, 350);
            }

            function endDamping()
            {
                
                _this.controls.removeEventListener('enddamping', endDamping);
                _this.mouseDown = false;
                if (_this.runningTweens == 0) 
                {
                    _this.aa = true;
//                    renderer.shadowMap.type = 2;
//                    matPaint.needsUpdate = true;
//                    matAlloy.needsUpdate = true;
//                    plane.material.needsUpdate = true;
//                    renderer.shadowMap.needsUpdate = true;
                    
                    render('endDamping');         
                }
//                renderer.shadowMap.enabled = true;
            }

            function setOrientationControls(e) 
            {      
                
                if (!e.alpha) {
                    return;
                }

                window.removeEventListener('deviceorientation', setOrientationControls, true);

                window.addEventListener('orientationchange', onOrientationChance, true);
                onOrientationChance();
                
            }

            // Needs secure location soon = https://
            function onOrientationChance(e) 
            {
                if (Math.abs(window.orientation) === 90) {
                    
                    _this.worientation = "landscape";
                    _this.paramsCam.fov = 32;
                    if (_this.currentCamera == 0)
                    {
                        _this.camera.fov = 60;  
                    }
                    else
                       _this.camera.fov = _this.paramsCam.fov;  
                    _this.camera.updateProjectionMatrix();  
//                    controls.update();
//                    controls.minDistance = 550;
//                    controls.maxDistance = 550;
//                    controls.update();
                    
                } 
                else 
                {
                    
                    _this.worientation = "portrait";
                    _this.paramsCam.fov = 46;
                    if (_this.currentCamera == 0)
                    {
                        _this.camera.fov = 80;   
                    }
                    else
                        _this.camera.fov = _this.paramsCam.fov; 
                    _this.camera.updateProjectionMatrix(); 
//                    controls.update();
//                    if (screenfull.isFullscreen)
//                        {
//                            controls.minDistance = 850;
//                            controls.maxDistance = 850;  
//                        }
//                    controls.update();
                }
//                resize();
                
            }


            function loadGLTF(name)
            {
               
               var fileName = name; 
                
                _this.loaderGLTF.load("glb/" + fileName + ".glb",function ( obj ) //json or gltf
                {
                    console.log(name);
//                    console.log(obj);
                    var parent;
                    var j;
                    
                    
                    
                    
                    
                    function getMeshes(obj)
                    {
                        
                        for (var k in obj)
                        {
                            if(typeof obj[k] == "object" && obj[k] !== null)
                            {
//                                console.log('Check here!');
//                                           console.log(obj[k].parent);
                               if(obj[k].children)
                               {
                                   if(obj[k].type != "Mesh")
                                       {
                                          getMeshes(obj[k].children) 
                                       }
                                    else
                                        { 
                                             _this.meshes.push(obj[k]);
//                                            console.log(obj[k]);
                                        }
                                       
                               }
                            }
                        }
                        
                    }
                    // Load combined GLB file or individual GLB files
                    if (name == 'exterior' || name == 'interior' )
                        {
                          parent = obj.scene; 
                            console.log(obj.scene.children.length);
                            
                            for (var i = 0; i < obj.scene.children.length; i++) 
                            {
//                                 
                                var objName = obj.scene.children[i].name;
                                objName = objName.slice(0, -3);
                                _this.meshes = [];
                                getMeshes(obj.scene.children[i].children);
                                prepareData(objName, _this.meshes);
       
//                                var geoArray = _this.meshes.map(function (obj) {
////                                  obj.updateMatrix();
////                                  obj.geometry.applyMatrix(obj.matrix);
//                                  console.log(obj.parent);
//                                  return obj.geometry;
//                                });
//                                
//                               
//                                
//                                var combinedGeo = mergeMeshes(geoArray);
//                                var combinedMesh = new THREE.Mesh( combinedGeo, _this.standardMat );
//                                 console.log(combinedMesh);
//                                
//                                _this.scene.add(combinedMesh);
//                                combinedMesh.position.x = -400;
                                
                                
                                
//                                var combinedGeo = mergeMeshes(_this.meshes);
//                                var combinedMesh = new THREE.Mesh( combinedGeo, _this.standardMat );
//
//                                _this.scene.add(combinedMesh);
//                                console.log(combinedMesh);
//                                combinedMesh.position.x = -400;
//                                console.log(objName);
//                                console.log(_this.meshes.length);
                            }
                        } 
                    else
                        {
//                            parent = obj.scene.children[0];
                            _this.meshes = [];
                            getMeshes(obj.scene.children[0]);
//                            console.log(_this.meshes);
                            prepareData(name, _this.meshes);


        //                    console.log(name);
        //                    console.log(meshes.length);
                            
                        } 
                        
                    
                    
//                    
                   
                    render('loadGLTF');
                    
//                  changeCamera(_this.currentCamera);
                    
                    
      
    
                });
  
            }
    
    
            function mergeClone(group, clone) {
    
//                    var mergedMeshClone = clone.children[0];
//                    mergedMeshClone.geometry.scale(1,1,-1);
//
//                    mergedMeshClone.geometry.verticesNeedUpdate = true;
//                    mergedMeshClone.geometry.normalsNeedUpdate = true;
//                    mergedMeshClone.geometry.computeBoundingSphere();
//                    mergedMeshClone.geometry.computeFaceNormals();
//                    mergedMeshClone.geometry.computeVertexNormals();
//                    
//                    for (var j = 0; j < clone.children.length; j++) {
//                        THREE.SceneUtils.attach( clone.children[j], clone, group );
//                    }
//                    
//                    mergeMeshes(group);
            }
    
//            function groupBy2(xs, prop) {
//              var grouped = {};
//              for (var i=0; i<xs.length; i++) {
//                var p = xs[i][prop];
//                if (!grouped[p]) { grouped[p] = []; }
//                grouped[p].push(xs[i]);
//              }
//              return grouped;
//            }
    
            function groupBy(arr, property) {
                
                  return arr.reduce(function(memo, x) {
                    if (!memo[x[property]]) { memo[x[property]] = []; }
                    memo[x[property]].push(x);
                    return memo;
                  }, {});
                
            }
    
    
             function mergeMeshes(group) {
 
//                    var o = groupBy(group.children, 'material.name'); // => {orange:[...], banana:[...]}
//                    console.log(o);
//                 
//                    var geoArray = group.children.map(function (obj) {
////                                  obj.updateMatrix();
////                                  obj.geometry.applyMatrix(obj.matrix);
//                      console.log(obj);
//                      return obj.geometry;
//                    });
//
//                 
//                    var modelGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( geoArray );
//                    var combinedMesh = new THREE.Mesh( modelGeometry, _this.matPaint );
////                     console.log(combinedMesh);
////
//                    for (var i = group.children.length - 1; i >= 0; i--) {
//                        group.remove(group.children[i]);
//                    }
//                    group.add(combinedMesh);
                        
                 
            };
    
            function prepareData(name, meshArray)
            {
//                var name = group.name;
                var group = new THREE.Group();
                var clone = new THREE.Group();

                group.name = name;
                
                if (name != 'blob') _this.model.add( group );

                for (var i = 0; i < meshArray.length; i++) 
                {
//                            console.log(meshArray[i]);    
                    group.add( meshArray[i] );

                    if (name != 'blob') meshArray[i].castShadow = true;
                    if (name != 'blob') meshArray[i].receiveShadow = true;
                    meshArray[i].material = _this.standardMat;
//                    console.log(meshArray[i].material);
                }
                if (name == 'simple' )
                {
                    group.scale.set(5,5,5);
                }

                if (name == 'seat' )
                {
                    assignMaterials(group);
                    
                    clone = createClone(group);
                    _this.model.add(clone);
                    
                } 
                else if (name == 'top' )
                {
                    assignMaterials(group);
                    group.add( createClone(meshArray[1]) );
                }
                else if (name == 'trunk' )
                {
                    //  Helper to position pivot point of door
//                    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
//                    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 0.5} );
//                    var sphere = new THREE.Mesh( geometry, material );
//                    _this.scene.add( sphere );
//                    sphere.position.set(366, 140, 0);
                    
                    var translation = new THREE.Matrix4().makeTranslation(-366, -138, 0);
                    for (var j = 0; j < meshArray.length; j++) {
                        meshArray[j].geometry.applyMatrix(translation);
                    }
                    group.position.set(366, 138, 0);
                    
                    assignMaterials(group);
                    _this.gtrunkLid = group;
                }
                else if (name == 'door' || name == 'door_inside')
                {
                    // Helper to position pivot point of door
//                    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
//                    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 0.5} );
//                    var sphere = new THREE.Mesh( geometry, material );
//                    _this.scene.add( sphere );
//                    sphere.position.set(222, 80, 90);
//                    console.log('sphere helper');
//                    console.log(sphere);
                    
                    var boxFW = new THREE.Box3().setFromObject( group );
                    var translation = new THREE.Matrix4().makeTranslation(-222, -80, -90);
                    for (var j = 0; j < meshArray.length; j++) {
                        meshArray[j].geometry.applyMatrix(translation);
                    }
                    if(!_this.gdoorDriver)
                    {
                        _this.gdoorDriver = new THREE.Group();
                        _this.gdoorDriver.position.set(222, 80, 90);
                        _this.gdoorDriver.name = 'gdoor';
                    }
                    _this.gdoorDriver.add(group);
                    assignMaterials(group);
                    
                    if(!_this.gdoorCoDriver)
                    {
                        _this.gdoorCoDriver = new THREE.Group();
                        _this.gdoorCoDriver.position.set(222, 80, -90);
                        _this.gdoorCoDriver.name = 'gdoor_clone';
                    }
                    clone = createClone(group);
                    clone.name = group.name + '_clone';
                    _this.gdoorCoDriver.add(clone);
                    
                    _this.model.add(_this.gdoorDriver);
                    _this.model.add(_this.gdoorCoDriver);
                    
                    
                }
                else if (name == 'paint' )
                {
                    assignMaterials(group);
                    mergeMeshes(group);
                        
//                    alert(group.children.length);

                }
                else if (name == 'paint2' )
                {
                    assignMaterials(group);
                    clone = createClone(group);
                    _this.model.add(clone);
//                    group.add( createClone(meshArray[0]) );
                    
//                    var geoArray = _this.meshes.map(function (obj) {
////                                  obj.updateMatrix();
////                                  obj.geometry.applyMatrix(obj.matrix);
//                      console.log(obj.parent);
//                      return obj.geometry;
//                    });
//
//
//
//                    var combinedGeo = mergeMeshes(geoArray);
//                    var combinedMesh = new THREE.Mesh( combinedGeo, _this.standardMat );
//                     console.log(combinedMesh);
//
//                    _this.scene.add(combinedMesh);

                }
                else if (name == 'frontlamp' )
                {
                    assignMaterials(group);
                    mergeMeshes(group);
                    clone = createClone(group);
                    _this.model.add(clone);
                    
                    mergeClone(group, clone);
                   
                }
                else if (name == 'front' )
                {
                    assignMaterials(group);
                    group.add( createClone(meshArray[0]) );
                }
                else if (name == 'rear' )
                {
                    assignMaterials(group);
                    group.add( createClone(meshArray[2]) );
                    group.add( createClone(meshArray[16]) );
                    group.add( createClone(meshArray[17]) );
                    group.add( createClone(meshArray[19]) );
                    group.add( createClone(meshArray[20]) );
                    group.add( createClone(meshArray[21]) );
                    group.add( createClone(meshArray[22]) );

                }
                else if (name == 'side' )
                {
                    assignMaterials(group);
                    
                    for (var i = 0; i < meshArray.length; i++) 
                    {
                        if (i != 13 && i != 14 && i != 15 && i != 16) 
                            {
                                if (i == 5 || i == 6 || i == 7 || i == 8 || i == 9)
                                {
                                    // 
                                    clone.add( createClone(meshArray[i], false) ); // don't mirror logo
                                    meshArray[i].rotation.y = THREE.Math.degToRad(-180);
                                    meshArray[i].position.x = 574.7;
                                }
                                else
                                    clone.add( createClone(meshArray[i]) );
                            }       
//                        console.log (meshArray.length);
                    }
                    
                    mergeMeshes(group);
                    _this.model.add( clone );
                    
                    // Individual created clone needs to be merged separatly
                    mergeMeshes(clone);

                    mergeClone(group, clone);
                    

                }
                else if (name == 'rearlamp' )
                {
                    assignMaterials(group);
                    mergeMeshes(group);
                    clone = createClone(group);
                    _this.model.add(clone);
                }
                else if (name == 'chrome' )
                {
                    assignMaterials(group);
                    clone.add( createClone(meshArray[2]) );
                    clone.add( createClone(meshArray[3]) );
                    clone.add( createClone(meshArray[4]) );
                    clone.add( createClone(meshArray[5]) );
                    _this.model.add( clone );
                }
                else if (name == 'parts' )
                {
                    assignMaterials(group);
                    group.add( createClone(meshArray[3]) );
                    group.add( createClone(meshArray[9]) );
                    group.add( createClone(meshArray[10]) );
                    group.add( createClone(meshArray[12]) );
                    group.add( createClone(meshArray[13]) );
                    group.add( createClone(meshArray[6]) );
//                        _this.model.add( clone );

                }
                else if (name == 'window')
                {  
                    // Solution for alpha flackering issue 
                    meshArray[0].renderOrder = 10000; 
                }

//                else if (name.indexOf('wheel') != -1)q6x
//                {
                else if (name == 'q6x' || name == 'q8u')
                { 
                    _this.pivotWheelRLRot.remove( _this.wheelRL );
                    _this.pivotWheelRRRot.remove( _this.wheelRR );
                    _this.pivotWheelFLRot.remove( _this.wheelFL );
                    _this.pivotWheelFRRot.remove( _this.wheelFR );

                    _this.wheelFL = group;

                    assignMaterials(group);

                    var boxFW = new THREE.Box3().setFromObject( _this.wheelFL );
//                        console.log(boxFW);

                    for (var j = 0; j < _this.wheelFL.children.length; j++) {
                        boxFW.getCenter( _this.wheelFL.children[j].position );
                        // this re-sets the mesh position

                        _this.wheelFL.children[j].position.multiplyScalar( - 1 ); 
//                            console.log(_this.wheelFL.children[j].position);
                    }

                    _this.wheelFR = _this.wheelFL.clone();
                    _this.wheelFR.rotation.y = THREE.Math.degToRad(180);
//
                    _this.wheelRL = _this.wheelFL.clone();

                    _this.wheelRR = _this.wheelRL.clone();
                    _this.wheelRR.rotation.y = THREE.Math.degToRad(180);
//                        
                    _this.pivotWheelFLRot.add( _this.wheelFL );
                    _this.pivotWheelFRRot.add( _this.wheelFR ); 
                    _this.pivotWheelRLRot.add( _this.wheelRL );
                    _this.pivotWheelRRRot.add( _this.wheelRR );
                }
                else if (name == 'j56_front' || name == 'j57_front' )
                {

                    _this.pivotWheelFL.remove( _this.brakeFL );
                    _this.pivotWheelFR.remove( _this.brakeFR );
                    
                    assignMaterials(group);
      
                    var boxFW = new THREE.Box3().setFromObject( group );
                    for (var j = 0; j < group.children.length; j++) {
                        boxFW.getCenter( group.children[j].position );
                        // this re-sets the mesh position
                        group.children[j].position.multiplyScalar( - 1 ); 
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
                }
                else if (name == 'j56_rear' || name == 'j57_rear')
                {
//                    _this.pivotWheelRL.remove( _this.brakeRL );
//                    _this.pivotWheelRR.remove( _this.brakeRR );
                    _this.model.remove( _this.brakeRL );
                    _this.model.remove( _this.brakeRR );
                    
                    assignMaterials(group);
                    
                    _this.brakeRL = group;
                    if (name == 'j57_rear') 
                        _this.brakeRL.position.y += 1.3;
                    _this.brakeRR = createClone(_this.brakeRL);
                    if (name == 'j57_rear') 
                        _this.brakeRR.position.y += 1.3;
                    _this.model.add(_this.brakeRR);
                }
                else if (name == 'blob')
                {

                    meshArray[0].material = _this.matBlob;
                        meshArray[0].geometry.center();
//                        meshArray[0].castShadow = false;
//                        group.position.set(0,-3,295);
                    group.rotation.x = THREE.Math.degToRad(-90);
                    group.rotation.z = THREE.Math.degToRad(60);
                    //group.scale.set(1.4,1.4,1.4);
                    group.position.x = 300;
//                    group.position.y = 400;
                    group.position.y = 614.5;
//                        group.scale.set(-.1,-.1,.1);
//                        group.position.y = 977;  // Scale 1 = 604 570
//                        group.position.y += 882;
//                    group.position.x = 260;

                    // Other Blob
//                        group.scale.set(1.25,1.25,1.25);
//                        group.position.y = 742;

//                    group.rotation.z = THREE.Math.degToRad(0);
//                        group.rotation.x = THREE.Math.degToRad(30);
                    //meshArray[0].matrixAutoUpdate = false;
                    _this.blob = group;
                    _this.blob.visible = false;
//                        console.log("blob");
//                        console.log(_this.blob);
                    _this.scene.add( _this.blob );
                }
                else
                {
                    // If nothing has to be done with the geometries we can assign the materials
                    assignMaterials(group);
                }
                render('prepareData');
//                
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
                
                if (obj.type == 'Object3D' || obj.type == 'Group')
                {
                    
                    if (obj.type == 'Object3D') 
                        clonedObj = new THREE.Object3D();
                    else
                        clonedObj = new THREE.Group();
                    if (mirror) clonedObj.applyMatrix(mS);

                    for (var j = 0; j < obj.children.length; j++) 
                    {
//                        materialClone = obj.children[j].material.clone();
                        var newMesh = new THREE.Mesh(obj.children[j].geometry.clone(), obj.children[j].material);
                        if (obj.children[j].castShadow) newMesh.castShadow = true;
                        if (obj.children[j].receiveShadow) newMesh.receiveShadow = true;
                        newMesh.material.side = 2; // Clickable clones = 2
//                        newMesh.material.shadowSide = 2;
                        clonedObj.add(newMesh);
                    }
                }
                else if (obj.type == 'Mesh')
                {
                    clonedObj = new THREE.Mesh(obj.geometry.clone(),obj.material); //obj.material.clone()
                    if (obj.castShadow) clonedObj.castShadow = true;
                    if (obj.receiveShadow) clonedObj.receiveShadow = true;
                    if (mirror) clonedObj.applyMatrix(mS);      
                    clonedObj.material.side = 2; // Clickable clones = 2
//                    clonedObj.material.shadowSide = 2;
                    
                }
//                console.log(clonedObj);
                return clonedObj;

			}

            function createColorTexture(color)
            {
//                alert(color);
                var canvas = document.getElementById("colorcanvas");
                
                var ctx = canvas.getContext("2d");
                ctx.fillStyle=color;
                ctx.fillRect(0,0,2,2);
//                console.log(color);
                var texture = new THREE.CanvasTexture(canvas);
                return texture;
            }
            

            function createMaterialLibrary()
            {
                _this.matBlob = new THREE.MeshBasicMaterial   ( { 
                                      color: 0xffffff
                } );
                
                _this.matSimple = new THREE.MeshStandardMaterial( {
                        color: 0x555555,
                        side: 2
                    } );
                _this.standardMat = new THREE.MeshPhysicalMaterial( {
                        color: 0x2A3233,
                        shadowSide: 2,
                        envMapIntensity: 0.2,
                        roughness: 0.2,
                        metalness: 0
                    } );
//                physicalMaterial = standardMat;
                
//                standardMat.needsUpdate = true;
                    
//                    matBlob.bumpMap = matBlob.map;
                    // Black Interior & Holes      
                    _this.matBlack = new THREE.MeshBasicMaterial( {
                        color: 0,
                        side: 2
                    } );
                    _this.matLicense = new THREE.MeshStandardMaterial( { 
                        color: 0xffffff, 
                        roughness: 1,
                        map: _this.loaderc.load( 'textures/model/exterior/licenseplate_' + _this.textureformat + '.ktx', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearFilter;
//                                texture.flipY = false;
//                                texture.wrapT = THREE.RepeatWrapping;
//                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(1, 2 );
//                                texture.offset.set(0, -1);
                        })
                        //, + _this.textureformat + '.ktx')
                        //normalMap: texloader.load('textures/model/license_normal.png')
                    } );

                 _this.matPrimer = new THREE.MeshStandardMaterial( {
                            color: 0x030303,
                            roughness: 1,
                            metalness: 0,
                            envMapIntensity: 0.2,
                            side: 2
//                            envMap: texloader.load('textures/env/map.png')
                            //reflectivity: 1,
                            //blending: 0
                        } );
//                    matPrimer.envMap.mapping = THREE.EquirectangularReflectionMapping;
                
                    _this.matInteriorBlack = new THREE.MeshStandardMaterial( {
                            color: 0x191919,
                            roughness: 1,
                            metalness: 0,
                            envMapIntensity: 0.2,
                            side: 0
                    } );
                

                
                    _this.matPlasticGloss = new THREE.MeshStandardMaterial( {
                        color: 0, //0xb91524
                        roughness: 0,
                        metalness: 1,
                        envMapIntensity: 1
                        //blending: 0
                    } );
                    _this.matWhite = new THREE.MeshBasicMaterial( {
                        //transparent: true,
                        color: 0xffffff, 
                        side: 2
                    } );

                _this.matPlastic = new THREE.MeshStandardMaterial( {
                        color: 0x222222, //0xb91524
                        roughness: 0.5,
                        metalness: 0,
                        envMapIntensity: .5,
                        side: 2
                } );
                _this.matPlasticDark = new THREE.MeshStandardMaterial( {
                        color: 0x151515, //0xb91524
                        roughness: .6,
                        metalness: 0,
                        envMapIntensity: 0.2,
                        side: 2
                } );
                
                _this.matSeam = new THREE.MeshStandardMaterial( {
                        color: 0x777777, //0xb91524
                        roughness: 1,
                        metalness: 0,
                        envMapIntensity: .8,
                        side: 0
                } );
                
                _this.matBelt = new THREE.MeshStandardMaterial( {
                        color: 0xff0000, //0xb91524
                        roughness: 1,
                        metalness: 0,
                        map: _this.loaderTextures.load( 'textures/model/interior/belt.jpg', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
//                                texture.flipY = false;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(2,2);
//                                texture.offset.set(0, -1);
                            }),
                        envMapIntensity: 1,
                        side: 2
                } );
                
                _this.matLeather = new THREE.MeshStandardMaterial( {
                        color: 0x757575, //0x757575
                        roughness: .8,
                        metalness: 0,
                        map: _this.loaderTextures.load( 'textures/model/interior/leather.jpg', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
//                                texture.flipY = false;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(2.25,2.25);
//                                texture.offset.set(0, -1);
                            }),
                        normalMap: _this.loaderTextures.load( 'textures/model/interior/leather_normal.jpg', function ( texture ) {  
//                                texture.magFilter = THREE.LinearFilter;
//                                texture.minFilter = THREE.LinearFilter;
//                                texture.flipY = false;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(2.25,2.25);
//                                texture.offset.set(0, -1);
                            }),
                        normalScale: new THREE.Vector3( 1, 1 ),
                        envMapIntensity: 0.5,
                        side: 2
                } );
                
                _this.matSpeaker = new THREE.MeshStandardMaterial( {
                        color: 0x757575, //0x757575
                        roughness: .8,
                        metalness: 0,
                        map: _this.loaderTextures.load( 'textures/model/interior/speaker.jpg', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
//                                texture.flipY = false;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(2.25,2.25);
//                                texture.offset.set(0, -1);
                            }),
                        normalMap: _this.loaderTextures.load( 'textures/model/interior/speaker_normal.jpg', function ( texture ) {  
//                                texture.magFilter = THREE.LinearFilter;
//                                texture.minFilter = THREE.LinearFilter;
//                                texture.flipY = false;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(2.25,2.25);
//                                texture.offset.set(0, -1);
                            }),
                        normalScale: new THREE.Vector3( 1, 1 ),
                        envMapIntensity: 0.5,
                        side: 2
                } );
                
                _this.matDecor = new THREE.MeshStandardMaterial( {
                            color: 0xcccccc,
                            roughness: 0.5,
                            metalness: 0.5,
                            envMapIntensity: .8,
                            side: 0
                    } );
                
                 _this.matCarbon = new THREE.MeshStandardMaterial( {
                            color: 0xffffff,
                            roughness: 0.2,
                            metalness: 0,
//                            map: _this.carbonTexture,
//                            normalMap: _this.wheelTextureNormal,
//                            normalScale: new THREE.Vector3( 3, 3 ),
                            map: _this.loaderTextures.load( 'textures/model/interior/carbon.jpg', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
//                                texture.flipY = false;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.repeat.set(1,1);
//                                texture.offset.set(0, -1);
                            }),
                            envMapIntensity: .8,
                            side: 0
                    } );
                
                _this.matCarpet = new THREE.MeshStandardMaterial( {
                            color: 0,
                            roughness: 1,
                            metalness: 0,
                            normalMap: _this.loaderTextures.load( 'textures/model/interior/carpet_normal.jpg', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
//                                texture.repeat.set(1,1);
                            }),
                            normalScale: new THREE.Vector3( 1, 1 ),
                            map: _this.loaderTextures.load( 'textures/model/interior/carpet.jpg', function ( texture ) {  
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.wrapS = THREE.RepeatWrapping;
//                                texture.repeat.set(1,1);
                            }),
                            envMapIntensity: 1,
                            side: 2
                    } );

                _this.matTread = new THREE.MeshStandardMaterial( {
                            color: 0x222222,
                            roughness: 1,
                            metalness: 0.1,
                            map: _this.wheelTexture,
//                            normalMap: _this.wheelTextureNormal,
//                            normalScale: new THREE.Vector3( 3, 3 ),
                            bumpMap: _this.wheelTexture,
                            bumpScale: 1.5,
                            envMapIntensity: 0.1,
                            side: 0
                    } );
                _this.matTire = new THREE.MeshStandardMaterial( {
                            color: 0xffffff,
                            roughness: 1,
                            metalness: 0,
                            map: _this.wheelTexture2,
                            envMapIntensity: .3,
                            side: 0
                    } );
               
                // Bremsscheibe
                _this.matDisk = new THREE.MeshPhysicalMaterial( { 
                        color: 0x666666,
                        roughness: 0.5,
                        map: _this.discTexture,
                        metalness: 1,
                        clearCoat: .5,
                        clearCoatRoughness: 0.5,
//                        envMap: sphericalTexture,
                        reflectivity: 0,
                        side: 2,
                        } );
//                console.log(_this.matDisk);
                // Bremsscheibe
                _this.matDisk2 = new THREE.MeshPhysicalMaterial( { 
                        color: 0x666666,
                        roughness: 0.5,
                        map: _this.discTexture2,
                        metalness: 1,
                        clearCoat: .5,
                        clearCoatRoughness: 0.5,
//                        envMap: sphericalTexture,
                        reflectivity: 0,
                        side: 2,
                        } ); 
//                console.log(_this.matDisk2);
                // Bremsklotz
                _this.matCaliper = new THREE.MeshStandardMaterial( { 
                        color: 0xFFC32B, 
                        roughness: 0.5,
                        metalness: 0.5,
                        envMapIntensity: .6
                    } );
                _this.matCaliper.map = createColorTexture('#FFC32B');
                _this.matCaliper.color.setHex( 0xffffff );
                
                _this.matCaliperLogo = new THREE.MeshBasicMaterial( {
                        color: 0,
                        side: 2
                    } );
                
                _this.matStripe = new THREE.MeshStandardMaterial( { 
                        color: 0x111111, 
                        roughness: 0.5,
                        metalness: 0.5,
                        envMapIntensity: .6
                    } );
//                _this.matStripe.map = createColorTexture('#111111');
//                _this.matStripe.color.setHex( 0xffffff );
                
                _this.matPaint = new THREE.MeshPhysicalMaterial( { 
                        color: _this.paintTotal[_this.paintPos - 1].color,//0x0B1940
                        roughness: _this.paintTotal[_this.paintPos - 1].roughness,
                        metalness: _this.paintTotal[_this.paintPos - 1].metalness,
                        clearCoat: _this.paintTotal[_this.paintPos - 1].clearCoat,
                        clearCoatRoughness: _this.paintTotal[_this.paintPos - 1].clearCoatRoughness,
                        envMapIntensity: _this.paintTotal[_this.paintPos - 1].envMapIntensity,
                        reflectivity: _this.paintTotal[_this.paintPos - 1].reflectivity
                        } );
                _this.matPaint.map = createColorTexture('#' + _this.matPaint.color.getHexString());
                _this.matPaint.color.setHex( 0xffffff );
                _this.matPaint.shadowSide = 1;
//                console.log('""""""""""""""""""""""""');
//                console.log(_this.matPaint.castShadow);
               
                
                
                    
                    _this.matMirror = new THREE.MeshStandardMaterial( { 
//                        color: paintTotal[1],
                        color: new THREE.Color().setHex ( 0 ),
                        roughness: 1,
                        metalness: 1,
                        side: 2
                        } );
//                    matMirror.envMap.mapping = THREE.EquirectangularReflectionMapping;
                
                _this.matMirrorGlas = new THREE.MeshStandardMaterial( { 
                        color: 0xffffff,
                        roughness: 0,
                        metalness: 0,
//                        opacity: .9,
                        transparent: false,
                        side: 2
                        } );
//                matMirrorGlas.envMap.mapping = THREE.EquirectangularReflectionMapping;
//                    matMirrorGlas.envMap.mapping = THREE.SphericalReflectionMapping;


                _this.matWindow = new THREE.MeshStandardMaterial( {
                            color: 0x444444,
                            roughness: 0,
                            metalness: 1,
                            opacity: .8,
                            transparent: true,
                            side: 2
                    } );
                _this.matWindowPrivat = new THREE.MeshStandardMaterial( {
                            color: 0x111111,
                            roughness: 0,
                            metalness: 1,
                            opacity: .65,
                            transparent: true,
                            side: 2
                    } );
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
                
                _this.matGlas = new THREE.MeshStandardMaterial( {
                            color: 0x666666,
                            depthWrite: true,
                            roughness: 0,
                            metalness: .5,
                            opacity: .45,
                            transparent: true,
//                            wireframe: true,
                            side: 2
                    } );
                
                _this.matGlasDark = new THREE.MeshStandardMaterial( {
                            color: 0x444444,
                            depthWrite: false,
                            roughness: 1,
                            metalness: 0,
                            opacity: .45,
                            transparent: true,
//                            wireframe: true,
                            side: 1
                    } );
                
                _this.matGlasRed = new THREE.MeshStandardMaterial( { 
                            color: 0xff0000, //0xc80009
                            roughness: 0,
                            metalness: .75,
//                            depthWrite: false,
                            envMapIntensity: .7,
                            opacity: .65,
                            transparent: true,
                            side: 2
                    } );
                _this.matGlasOrange = new THREE.MeshStandardMaterial( { 
                            color: 0xF44900, //0xc80009
                            roughness: 0,
                            metalness: .75,
//                            depthWrite: false,
                            envMapIntensity: .7,
                            opacity: .65,
                            transparent: true,
                            side: 2
                    } );
                _this.matAlu = new THREE.MeshPhysicalMaterial( { 
                            color: 0x555555, 
                        roughness: 0.2,
                        metalness: 0.4,
                        clearCoat: 1,
                        clearCoatRoughness: 0,
                        envMapIntensity: .4,
                        reflectivity: .6,
                            metalnessMap: false,
                            roughnessMap: false //wheelTexture
                    } );
                _this.matAluDark = new THREE.MeshPhysicalMaterial( { 
                            color: 0x222222, 
                        roughness: 0,
                        metalness: 0.4,
                        clearCoat: 1,
                        clearCoatRoughness: 0,
                        envMapIntensity: .1,
                        reflectivity: 1,
                            metalnessMap: false,
                            roughnessMap: false //wheelTexture
                    } );
                
                _this.matAlu2 = new THREE.MeshPhysicalMaterial( { 
                            color: 0x555555, 
                        roughness: 0.2,
                        metalness: 0.4,
                        clearCoat: 1,
                        clearCoatRoughness: 0,
                        envMapIntensity: .2,
                        reflectivity: .6,
                            metalnessMap: false,
                            roughnessMap: false //wheelTexture
                    } );

                _this.matDSLogo = new THREE.MeshStandardMaterial( { 
                        color: 0, //0xa80202
                        roughness: 1,
                        metalness: 0,
                        envMapIntensity: 1,
                        side: 2
                        } );
//                {name:'Matador Red metallic',color:0xa80202,roughness: 0.6,metalness: 0.8,clearCoat: 1,clearCoatRoughness: 0,reflectivity: 1,envMapIntensity: 1}, 
                
                _this.matAlloy = new THREE.MeshPhysicalMaterial( { 
                        color: 0x333333,
                        roughness: 0.4,
                        metalness: 1,
                        clearCoat: 1,
                        clearCoatRoughness: 0.3,
                        envMapIntensity: .7,
                        reflectivity: .2,
                        side: 2
                        } );
                _this.matAlloyContrast = new THREE.MeshPhysicalMaterial( { 
                        color: 0xff0000,
                        roughness: .5,
                        metalness: .5,
                        clearCoat: 1,
                        clearCoatRoughness: 0,
                        envMapIntensity: .6,
                        reflectivity: .5,
                        side: 2
                        } );
                _this.matAlloyDark = new THREE.MeshPhysicalMaterial( { 
                        color: 0x111111,
                        roughness: .5,
                        metalness: .5,
                        clearCoat: 1,
                        clearCoatRoughness: 0.2,
                        envMapIntensity: .4,
                        reflectivity: .2,
                        side: 2
                        } );                
                _this.matChrome = new THREE.MeshPhysicalMaterial( { 
                        color: 0x999999,
                        roughness: 0.3,
                        metalness: 1,
                        clearCoat: 1,
                        clearCoatRoughness: 0.8,
                        envMapIntensity: 1,
                        reflectivity: 1,
                        side: 2,
                        } );
//                physicalMaterial = matAlloyContrast;
                _this.matLogoRed = new THREE.MeshPhysicalMaterial( { 
                        color: 0xFF0000,
                        roughness: 0.5,
                        metalness: 0.5,
                        clearCoat: 1,
                        clearCoatRoughness: 0.5,
                        envMapIntensity: .5,
                        side: 2,
                        } );
                _this.matLogoWhite = new THREE.MeshBasicMaterial( {
                        //transparent: true,
                        color: 0xffffff, 
                        side: 2
                    } );
                _this.matLogoYellow = new THREE.MeshBasicMaterial( {
                        //transparent: true,
                        color: 0xFFB603, 
                        side: 2
                    } );
                _this.matLogoBlue = new THREE.MeshBasicMaterial( {
                        //transparent: true,
                        color: 0x008EDE, 
                        side: 2
                    } );
                
                _this.physicalMaterial = _this.matPaint;
                
                loadHDRReflection(_this.envGUICurrent);
//                loadEXRReflection();
     
			}

            function loadEXRReflection()
            {
                new THREE.EXRLoader().load( 'textures/concorde.exr', function ( texture ) {

					texture.minFilter = THREE.NearestFilter;
					texture.magFilter = THREE.NearestFilter;
					texture.encoding = THREE.LinearEncoding;

					var cubemapGenerator = new THREE.EquiangularToCubeGenerator( texture, 512 );
					var cubeMapTexture = cubemapGenerator.update( renderer );

					var pmremGenerator = new THREE.PMREMGenerator( cubeMapTexture );
					pmremGenerator.update( renderer );

					var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
					pmremCubeUVPacker.update( renderer );

					exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

					texture.dispose();
					cubemapGenerator.dispose();
					pmremGenerator.dispose();
					pmremCubeUVPacker.dispose();
                    
                    matChrome.envMap = matAlloy.envMap = matAlloyContrast.envMap = matAlloyDark.envMap = matGlasRed.envMap = matGlas.envMap = matCaliper.envMap =  matAlu.envMap = _this.matAlloyDark.envMap = matWindowPrivat.envMap = matWindow.envMap = matMirror.envMap = matPaint.envMap =  matDSLogo.envMap = exrCubeRenderTarget.texture;
                    matTire.envMap = matTread.envMap = exrCubeRenderTarget.texture;

				} );

            }

            function loadHDRReflection(env)
            {
                var genCubeUrls = function( prefix, postfix ) {
                    return [
                        prefix + 'left' + postfix, prefix + 'right' + postfix,
                        prefix + 'top' + postfix, prefix + 'bottom' + postfix,
                        prefix + 'back' + postfix, prefix + 'front' + postfix
                    ];
                };
                
				var hdrUrls = genCubeUrls( './textures/' + env + '/reflection.' , ".hdr" ); //paris
				new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, hdrUrls, function ( hdrCubeMap ) {

//                    hdrCubeMap.encoding = THREE.sRGBEncoding;
					var pmremGenerator = new THREE.PMREMGenerator( hdrCubeMap );
					pmremGenerator.update( _this.renderer );

					var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
					pmremCubeUVPacker.update( _this.renderer );

					_this.hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
                    _this.hdrCubeRenderTarget.texture.encoding = THREE.RGBM16Encoding;
                    
                    _this.matTire.envMap = _this.matTread.envMap = _this.matCaliper.envMap = _this.matAlu.envMap = _this.matAluDark.envMap = _this.matAlu2.envMap = _this.matGlasRed.envMap = _this.matGlas.envMap = _this.matPrimer.envMap = _this.matChrome.envMap = _this.matLogoRed.envMap = _this.matMirror.envMap = _this.matAlloy.envMap = _this.matAlloyContrast.envMap = _this.matAlloyDark.envMap =_this.matGlasOrange.envMap = _this.matWindowPrivat.envMap = _this.matWindow.envMap = _this.matMirror.envMap = _this.standardMat.envMap = _this.matSeam.envMap =_this.matPlasticDark.envMap = _this.matPlastic.envMap = _this.matPlasticGloss.envMap = _this.matLicense.envMap = _this.matDisk.envMap = _this.matDisk2.envMap = _this.matStripe.envMap = _this.matPaint.envMap = _this.matDSLogo.envMap = _this.matMirrorGlas.envMap = _this.matBelt.envMap = _this.matCarpet.envMap = _this.matDecor.envMap = _this.matLeather.envMap = _this.matSpeaker.envMap = _this.matCarbon.envMap = _this.hdrCubeRenderTarget.texture; //_this.matBrakeDisc.envMap = 

//                    console.log(_this.standardMat);
//                    matPaint.lightMap = hdrCubeRenderTarget.texture;
                    render();

				} );
            }
            
//THREE.LinearEncoding
//THREE.sRGBEncoding
//THREE.GammaEncoding
//THREE.RGBEEncoding
//THREE.LogLuvEncoding
//THREE.RGBM7Encoding
//THREE.RGBM16Encoding
//THREE.RGBDEncoding
//THREE.BasicDepthPacking
//THREE.RGBADepthPacking

            function keyUpHandler(event)
            {
                event.preventDefault();
                event.stopPropagation();
                event.cancelBubble = true;
//                console.log(event.keyCode);
//                var keyPressed = String.fromCharCode(event.keyCode);
//                console.log(keyPressed);
                if (event.keyCode == "16")
                {
                   controls.enableZoom = false; 
                }
                if (event.keyCode == "17")
                {
                   controls.enablePan = false; 
                }
            }

            function keyDownHandler(event)
            {
                event.preventDefault();
                event.stopPropagation();
                event.cancelBubble = true;
                console.log(event.keyCode);
                var keyPressed = String.fromCharCode(event.keyCode);
                //console.log(keyPressed);
//                if (event.keyCode == "16")
//                {
//                   controls.enableZoom = true; 
//                }
//                if (event.keyCode == "17")
//                {
//                   controls.enablePan = true; 
//                }
//                else if (event.keyCode == "32") // space bar
//                {
//                    goFullscreen();
//                }
//                else if (event.keyCode == "37")
//                {
//                    prevCamera();
//                }
//                else if (event.keyCode == "39")
//                {
//                    nextCamera();
//                }
//                else if (event.keyCode == "38" || event.keyCode == "40")
//                {
//                    if (currentCamera == 3)
//                        animateLid();
//                    else if (currentCamera == 0)
//                        {
//
//                        }
//                    else if (currentCamera == 2)
//                        animateDoors();
//                    else if (currentCamera == 6)
//                        if (wheelInitPos)
//                            {
//                                animateWheel({wheel: THREE.Math.degToRad(30)});
//                                wheelInitPos = false;
//                            }
//                            else
//                            {
//                                animateWheel({wheel: THREE.Math.degToRad(-30)});
//                                wheelInitPos = true;
//                            }
//                    
//                    
//                }
//                else if (ev.type == "swipedown")
//                            {
//                                 
//                            }
                
//                else if (event.keyCode == "68") // D
//                {
//                    animateDoors();
//                }
//                else if (event.keyCode == "49") // D
//                {
//                    changeColorExt(1);
//                }
//                else if (event.keyCode == "50") // D
//                {
//                    changeColorExt(2);
//                }
//                else if (event.keyCode == "51") // D
//                {
//                    changeColorExt(3);
//                }
//                else if (event.keyCode == "52") // D
//                {
//                    changeColorExt(4);
//                }
//                else if (event.keyCode == "53") // D
//                {
//                    changeColorExt(5);
//                }
//                else if (event.keyCode == "54") // D
//                {
//                    changeColorExt(6);
//                }
//                else if (event.keyCode == "55") // D
//                {
//                    changeColorExt(7);
//                }
//                else if (event.keyCode == "56") // D
//                {
//                    changeColorExt(8);
//                }
//                else if (event.keyCode == "57") // D
//                {
//                    changeColorExt(9);
//                }
                if (keyPressed == "E") // D
                {
                    changeEnvironment("next");
                }
                if (keyPressed == "M")
                {
                   if (_this.blob.visible)
                    {
                        _this.blob.visible = false;
                    }    
                    else
                    {
                        _this.blob.visible = true;
                    }
                    render();
                }
                if (keyPressed == "O")
                {
//                   if (_this.ssaoRenderPassP.onlyAO)
//                    {
//                        _this.ssaoRenderPassP.onlyAO = false;
//                    }    
//                    else
//                    {
//                        _this.ssaoRenderPassP.onlyAO = true;
//                    }
//                    render();
                }
                if (keyPressed == "B")
                {
                    if (_this.bloomPass.enabled) 
                        _this.bloomPass.enabled = false;
                    else
                       _this.bloomPass.enabled = true; 
                    render();
                }
                if (keyPressed == "T")
                {
                    animateLid();
                    
                }
                if (keyPressed == "D")
                {
                    animateDoors();
                    
                }
                if (keyPressed == "R")
                {
                    changeRoof();
//                   animateLid();
                }
                if (keyPressed == "F")
                {
//                    if (_this.controls.enabled)
//                    {
//                        _this.controls.enableZoom = false;
//                        _this.controls.enablePan = false;
//                    }    
//                    else
//                    {
//                        _this.controls.enableZoom = true;
//                        _this.controls.enablePan = true;
//                    }
                }
                if (keyPressed == "G")
                {
                    toggleGUI();
                }
                if (keyPressed == "P")
                {
                    var strDownloadMime = "image/octet-stream";
                    var strMime = "image/png";
                    var imageData = _this.renderer.domElement.toDataURL(strMime);
                    saveFile(imageData.replace(strMime, strDownloadMime), "RX450h.png");
//                    window.open( renderer.domElement.toDataURL( 'image/png' ), 'screenshot' );
                }
            }

            function saveFile(strData, filename)
            {
                console.log(strData);   
                var link = document.createElement('a');
                if (typeof link.download === 'string')
                {
                    document.body.appendChild(link); //Firefox requires the link to be in the body
                    link.download = filename;
                    link.href = strData;
                    link.click();
                    document.body.removeChild(link); //remove the link when done
                }
                else
                {
                    location.replace(uri);
                }
            }

            function animateDoors()
            {
//                animateLid(gtrunkLid);
                animateDoor(_this.gdoorDriver);
                animateDoor(_this.gdoorCoDriver);
            }

            function fadeHotspots(value)
            {
//                hotspot_color.material.opacity = value;
//                hotspot_wheel.material.opacity = value;
//                hotspot_spin.material.opacity = value;
                //TweenLite.to(mesh.material, 2, {opacity: 0});
                aa = false;
                var positions = {opacity: hotspot_color.material.opacity};
                var targets = { opacity: value};
                
                tweener = new TWEEN.Tween( positions ).to(
                    targets
                , 200).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                    isRunningAnim = true;
                    
                    hotspot_color.material.opacity = positions.opacity;
                    hotspot_wheel.material.opacity = positions.opacity;
                    hotspot_spin.material.opacity = positions.opacity;
//                    renderer.render(sceneHUD, cameraHUD);
//                    aa = false;
//                    console.log(THREE.Math.radToDeg(group.rotation.z));
//                    render();
                }).onComplete(function () { 
                    hotspot_color.material.opacity = targets.opacity;
                    hotspot_wheel.material.opacity = targets.opacity;
                    hotspot_spin.material.opacity = targets.opacity;
                    aa = true;
                    isRunningAnim = false;
                    render('fadeHotspots');
//                    runningTweens--;
//                    if (runningTweens == 0) isRunningAnim = false;
//                    if (!isRunningAnim && !mouseDown)
//                    {
//                        aa = true;
////                        renderer.shadowMap.needsUpdate = true; 
//                        render();   
//                    }
                }).onStart(function () { 
//                    aa = false;
                    console.log('fadeHotspots');
                }).start(); 
            }
    
            

            function addCameraAnimation(targets)
            {
                tween2 = new TWEEN.Tween( positions ).to(
                    targets
                , 1000).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
//                    console.log(this.y);
                    if (this.y < 200)
                    {
                          interior.position.y = 0;
                          interior.position.x = 0;
                          interior.position.z = 0;
                          interior.visible = true;
                          model.visible = false;
                    }
//                        interiorMesh.visible = true;
//                        //seatMesh.visible = true;
//                        //modelCopy.add( blackInterior ); 
//                        //blackInterior.visible = false;
//                        mirror.children[3].visible = false;
//                        mirrorClone.children[3].visible = false;
//                        scene.remove( model );
//                        scene.add( modelCopy );
//                    }

                    camera.position.set(positions.x, positions.y, positions.z);
                    controls.target.set(positions.x2, positions.y2, positions.z2);
//                    camera.fov = positions.fov;
//                    camera.updateProjectionMatrix();
                    controls.update();
                    render('tweener2');
                    //render();
                }).onComplete(function () {
                    aa = true;
                    render('tweener2');
//                    if (_this.worientation == "landscape") controls.enabled = true;
                });
                
                tween.chain(tween2);

                
            }


            function prevCamera()
            {
                _this.hotspots.visible = true;
//                controls.enabled = false;
//                hotspots.visible = false;
//                hotspot_spin.visible = true;
                _this.currentCamera--;
                if (_this.currentCamera < 1) _this.currentCamera = _this.totalCamera;
                changeCamera('prev');
            }
            function nextCamera()
            {
                _this.hotspots.visible = true;
//                controls.enabled = false;
//                hotspots.visible = false;
//                hotspot_spin.visible = true;
                _this.currentCamera++;
                if (_this.currentCamera > _this.totalCamera) _this.currentCamera = 1;
                changeCamera('next');
            }
            function changeCamera(value, wheelPos)
            {
//                renderer.shadowMap.enabled = false;
                if (typeof value !== "string")
                    _this.currentCamera = value;
//                alert(value);
                var wheelPos = wheelPos;
//                if (!wheelPos)
//                    wheelPos = 0;
//                else
//                {
//                    if (wheelPos < 0)
//                        wheelPos = Math.max(-30, wheelPos);
//                    else if (wheelPos > 0)
//                        wheelPos = Math.min(30, wheelPos);  
//                }
                    
//                positionX: -480, //976, 
//                positionY: 60,// 218, 
//                positionZ: -240,//-450, 
//                orbitX: 140, 
//                orbitY: 60, 
//                orbitZ: 0
                // Reset constraints for animations
//                _this.controls.minPolarAngle = THREE.Math.degToRad(70); // radians Math.radians(-90);
//                _this.controls.maxPolarAngle = THREE.Math.degToRad(70); // radians
                _this.controls.minDistance = 0;
                _this.controls.maxDistance = Infinity;
                _this.controls.rotateSpeed = .25;
                
                _this.model.visible = true;
                _this.interior.visible = false;
                
//                _this.controls.minDistance = _this.paramsCam.maxDist;
//                _this.controls.maxDistance = _this.paramsCam.maxDist;
                // Initial constraints
                var constraints = { minP: 0, maxP: 90, minD:_this.paramsCam.minDist , maxD:_this.paramsCam.maxDist };
                
                switch(_this.currentCamera) {
                        

                // WHEEL
                case 3:
                    animateCamera({ x: 132, y: 102.5, z: 359, x2: 140, y2: 53, z2: 77, fov: 26, wheel: THREE.Math.degToRad(0)},{ minP: 0, maxP: 80, minD:200 , maxD:600 });
                    break;
                // FRONT VIEW
                case 8:
                    animateCamera({ x: -71, y: 280, z: -452, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(-15)},constraints);
                    break;
                // 3/4 FRONT RIGHT
                case 1:
                    animateCamera({ x: _this.paramsCam.positionX, y: _this.paramsCam.positionY, z: _this.paramsCam.positionZ, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(30)},constraints);    //fov: 30
                    break;
                // 3/4 FRONT LEFT
                case 2:
                    animateCamera({ x: -225, y: 60, z: 363, x2: 276, y2: 60, z2: 6, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(-30)},constraints);
                    break;        
                // 3/4 REAR RIGHT
                case 4:
                   
                    animateCamera({ x: 729, y: 103, z: 420, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(30)},constraints);
                    break;
                // REAR VIEW 
                case 5:
                    animateCamera({ x: 745, y: 122, z: 0, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(0)},constraints);   
                    break;
                // 3/4 REAR LEFT
                case 6:
                             //483.4499871197214 y: 380.4048172206881 z: -446.4447545787271
                    animateCamera({ x: 483, y: 380, z: -446, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(-30)},constraints); 
                    break;
                // SIDE LEFT
                case 7:
                    animateCamera({ x: 281, y: 109, z: -691, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(-10)},constraints); 
                    break;
                // INTERIOR VIEW
                case 0:
                    //animateCamera({ x: -767, y: 114, z: 24, x2: _this.paramsCam.orbitX, y2: _this.paramsCam.orbitY, z2: _this.paramsCam.orbitZ, fov: _this.paramsCam.fov, wheel: THREE.Math.degToRad(0)},constraints); 
//                    if (_this.isRunningCam)
//                    {
//                      _this.runningCameraTween--;  
//                    }
//                    if (_this.tween) _this.tween.stop();
                    _this.hotspots.visible = false;    
                    
//                    _this.camera.fov = 60;
//                    _this.camera.position.set( -38.5017, 110.018, 20.046 );
//                    _this.camera.updateProjectionMatrix();
//                    _this.controls.minPolarAngle = 0;
//                    _this.controls.maxPolarAngle = Math.PI;
//                    _this.controls.rotateSpeed = -.15;
//                    _this.controls.target.set( -38.5, 110, 20);
//                    _this.controls.update();
//                    render('interior');
                        
                        constraints = { minP: 0, maxP: Math.PI };
                        var _fov;
                        if (_this.worientation == "landscape") 
                            _fov = 60;
                        else
                           _fov = 80; 
                        _this.controls.rotateSpeed = -.15;
                        animateCamera({ x: -38.498, y: 110.0174, z: 20.0468, x2: -38.5, y2: 110, z2: 20, fov: _fov});
                    break;
                }   
 
            }
                    
            
            function returnFromDetail(e)
            {
                
                renderer.domElement.style.opacity = 1;
                engine2d.style.display = "none";
                trunk2d.style.display = "none";
                hotspots.visible = true;
                //animateCamera({ x: -560, y: 110, z: 177, x2: -35, y2: -44, z2: 0, wheel: THREE.Math.degToRad(0)});
                
                animateCamera({ x: 64, y: 658, z: 0, x2: 304, y2: 92, z2: 0, wheel: THREE.Math.degToRad(0)});
                window.removeEventListener('click', returnFromDetail);
                controls.enabled = true;
            }

            function animateCamera(targets, constraints) 
            {
                _this.positions = { x: _this.camera.position.x, y: _this.camera.position.y, z: _this.camera.position.z, x2: _this.controls.target.x, y2: _this.controls.target.y, z2: _this.controls.target.z, fov: _this.camera.fov, wheel: _this.pivotWheelFL.rotation.y};
                if (_this.isRunningCam)
                {
                  _this.runningCameraTween--;  
                }
                _this.runningCameraTween++;
                //controls.enabled = false;
                _this.isRunningCam = true;
                _this.aa = false;
                _this.model.visible = true;
                
//                interior.visible = false;
//                interior.position.y = -200;
                if (_this.tween) _this.tween.stop();
//                if (_this.tween2) _this.tween2.stop();
//                if (_this.tween3) _this.tween3.stop();
//                controls.enabled = false;
//                controls.minDistance = 0;
//	            controls.maxDistance = Infinity;
                _this.tween = new TWEEN.Tween( _this.positions ).to(
                    targets
                , 690).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                    _this.camera.position.set(_this.positions.x, _this.positions.y, _this.positions.z);
                    _this.controls.target.set(_this.positions.x2, _this.positions.y2, _this.positions.z2);
                    if (targets.fov) _this.camera.fov = _this.positions.fov;
                    _this.camera.updateProjectionMatrix();
                    if (targets.wheel != undefined)
                    {
                        _this.pivotWheelFL.rotation.y = _this.positions.wheel;
                        _this.pivotWheelFR.rotation.y = _this.pivotWheelFL.rotation.y;    
                    }
                    _this.aa = false;
                    _this.renderer.shadowMap.needsUpdate = true;
                    _this.controls.update();
                     //if (!check) 
//                    render('tweener');
                }).onComplete(function () {
//                    
                    if (constraints)
                    {
//                        if(constraints.minP) _this.controls.minPolarAngle = THREE.Math.degToRad(constraints.minP);
//                        if(constraints.maxP) _this.controls.maxPolarAngle = THREE.Math.degToRad(constraints.maxP); 
                        if(constraints.minA) _this.controls.minAzimuthAngle = THREE.Math.degToRad(constraints.minA); //-Infinity; radians
                        if(constraints.maxA) _this.controls.maxAzimuthAngle = THREE.Math.degToRad(constraints.maxA); //Infinity; radians  
//                        if(constraints.minD) _this.controls.minDistance = constraints.minD;
//                        if(constraints.maxD) _this.controls.maxDistance = constraints.maxD;
                    }
                    else
                    {
//                        _this.controls.maxPolarAngle = THREE.Math.degToRad(86); // radians 
                        _this.controls.minPolarAngle = 0;
                        _this.controls.maxPolarAngle = Math.PI;
                        _this.model.visible = false;
                        _this.interior.visible = true;
                    }
                    
                    
//                    tween.chain(tween2);
                    _this.runningCameraTween--;
//                    console.log(_this.runningCameraTween);
                    _this.isRunningCam = false;
                    console.log(_this.currentCamera);
                    switch(_this.currentCamera) {
                        case 2:
                            animateDoors();
                            break;
                        case 4:
                            animateLid();
                            break; 
                        case 6:
                            changeRoof();
                            break; 
                        default:
//                            alert(!_this.mouseDown);
                            if (!_this.isRunningCam && !_this.mouseDown)
                            {
//                                alert(_this.currentCamera);
                                _this.renderer.shadowMap.enabled = true;
                                _this.aa = true;
                                render('tweenerEnd');
                            }
                            break;
                    }
                    
//                    if (!_this.isRunningCam && !_this.mouseDown)
//                    {
//                        _this.renderer.shadowMap.enabled = true;
//                        _this.aa = true;
////                        renderer.shadowMap.needsUpdate = true; 
//                        render('tweenerEnd');
////                        hotspots.visible = true;
////                        fadeHotspots(1);
//                    }
                    
//                    aa = true;
//                    renderer.shadowMap.needsUpdate = true; 
//                    render('tweenerEnd');
                    

                    
                }).start();
                
                
            }

            function animateWheel(targets) 
            {
                runningTweens++;
                positions = {wheel: pivotWheelFL.rotation.y};
                isRunningWheel = true;
                aa = false;

                tween = new TWEEN.Tween( positions ).to(
                    targets
                , 690).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                    pivotWheelFL.rotation.y = positions.wheel;
                    pivotWheelFR.rotation.y = pivotWheelFL.rotation.y;    
                    aa = false;
                }).onComplete(function () {
                    
                    runningTweens--;
                    if (runningTweens == 0) isRunningWheel = false;
                    if (!isRunningWheel && !mouseDown)
                    {
                        aa = true;
                        render('tweenerEnd');
                    }
                }).start();
                
                
            }
    
            function animateDoor(group)
            {
                _this.runningTweens++;
                //controls.enabled = false;
                _this.isRunningAnim = true;
                _this.aa = false;
                var positions = { y: group.rotation.y};
                var targets;
                var nameParent = group.name;
                var closed = true;
//                alert(nameParent);
                switch(nameParent) {
                    // FRONT
                case 'gdoor':
                        if (!_this.doorDriver) {
                            _this.doorDriver = true;   
                        }
                        else
                        {
                            _this.doorDriver = false;
                            closed = false;
                        }
                    break;
                case 'gdoor_clone':
                        if (!_this.doorCoDriver) {
                            _this.doorCoDriver = true;
                        }
                        else
                        {
                            _this.doorCoDriver = false;
                            closed = false;
                        }
                     break;
                }
                if (closed){
//                     if (nameParent.indexOf('_clone') != -1)
//                        targets = { y: THREE.Math.degToRad(65)};
//                    else
                    var degree = -50;
                    if (nameParent == 'gdoor_clone') 
                        degree = 50;
                    targets = { y: THREE.Math.degToRad(degree)}; 
                }
                else{
                    targets = { y: THREE.Math.degToRad(0)};
                }
//                if (tweener)
//                {
//                    if (runningTweens != 1) runningTweens--;
//                    tweener.stop();
//                }
                _this.tweener = new TWEEN.Tween( positions ).to(
                    targets
                , 800).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                    //camera.position.x = positions.x;
                    group.rotation.y = positions.y;
                    
                    
                    _this.renderer.shadowMap.needsUpdate = true; //if (!check) 
                    _this.aa = false;
//                    render();
//                    console.log(THREE.Math.radToDeg(group.rotation.y));
                }).onComplete(function () {
                    
                    _this.runningTweens--;
                    if (_this.runningTweens == 0) _this.isRunningAnim = false;
                    if (!_this.isRunningAnim && !_this.mouseDown    )
                    {
                        _this.aa = true;
//                        renderer.shadowMap.needsUpdate = true; 
                        render('animateDoor');
                        
                        
                    }

                }).onStop(function () { 
//                    group.rotation.y = targets.y;
                }).onStart(function () { 
                    _this.aa = false;
//                    mustRender = true;
//                    console.log(_this.runningTweens);
                }).start();
            }
    
    
            function animateLid()
            {
                _this.runningTweens++;
                _this.isRunningAnim = true;
//                aa = false;
                var positions = { z: _this.gtrunkLid.rotation.z};
                var targets;
                if (!_this.trunkLid){
                    _this.trunkLid = true;
                    targets = { z: THREE.Math.degToRad(45)};
                }
                else{
                    _this.trunkLid = false;
                    targets = { z: THREE.Math.degToRad(0)};
                }
//                if (tweener)
//                {
//                    if (runningTweens != 1) runningTweens--;
//                    tweener.stop();
//                }
                _this.tweener = new TWEEN.Tween( positions ).to(
                    targets
                , 800).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                    //camera.position.x = positions.x;
                    _this.gtrunkLid.rotation.z = positions.z;
                    
//                    mustRender = true;
                    _this.renderer.shadowMap.needsUpdate = true; //if (!check) 
                    _this.aa = false;
//                    console.log(THREE.Math.radToDeg(group.rotation.z));
//                    render();
                }).onComplete(function () { 
                    _this.runningTweens--;
                    if (_this.runningTweens == 0) _this.isRunningAnim = false;
                    if (!_this.isRunningAnim && !_this.mouseDown)
                    {
                        _this.aa = true;
//                        renderer.shadowMap.needsUpdate = true; 
                        render('animateLid');   
                    }
                }).onStart(function () { 
                    _this.aa = false;
                }).start(); 
            }



            function changeENVTexture()
            {

                        
                    switch(currentBG) {
                        case 'mountains':
                                currentBG = 'city';
                                break;
                        case 'city':
                                currentBG = 'mountains';
                                break;
                    }
                    if (environment == 'real')
                    { 
//                        if (equirecTexture) equirecTexture.dispose();
                        
                        if (currentBG == 'mountains')
                        {
                            if (!mountains) 
                            {
//                                mountains = loaderc.load( 'textures/compressed/' + currentBG + '.dds', function ( texture ) {
                                mountains = loaderTextures.load( 'textures/coast/pano.jpg', function ( texture ) {
                                texture.mapping = THREE.EquirectangularReflectionMapping;
//                                texture.flipY = true;
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearFilter;
                                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                equirecTexture = texture;
                                updateBlob();
                                });
                            }
                            else
                            {
                                equirecTexture = mountains; 
                                updateBlob();
                            }
                                
                            
                        }
                        else
                        {
                            if (!city) 
                            {
//                                city = loaderc.load( 'textures/compressed/' + currentBG + '.dds', function ( texture ) {
                                city = loaderTextures.load( 'textures/coast/pano.jpg', function ( texture ) {
                                texture.mapping = THREE.EquirectangularReflectionMapping;
//                                texture.flipY = true;
                                texture.magFilter = THREE.LinearFilter;
                                texture.minFilter = THREE.LinearFilter;
                                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                                equirecTexture = texture;
                                updateBlob();
                                });
                            }
                            else
                            {
                                equirecTexture = city; 
                                updateBlob();
                            }
                        }
                    }
                    console.log(currentBG);

            }


            function modelRotation(dir)
            {

                rotateDir = dir;
                if (!mouseDown)
                {
                    aa = false;
                    rotateModel = true;
                    mouseDown = true;
                }
                else
                {
                    rotateDir = undefined;
                    aa = true;
                    rotateModel = false; 
                    mouseDown = false;
                    render('modelRotation');
                }


                
                   
                
            }

            function updateBlob() 
            {
                        matBlob.map = equirecTexture;
                    
                        blob.visible = true;

//                        matPaint.envMap = equirecTexture; 
//                        matWindow.envMap = equirecTexture;
//                        matMirror.envMap = equirecTexture;
//                        matChrome.envMap = equirecTexture; 
//                        matGlas.envMap = equirecTexture;
//                        matAluDark.envMap = equirecTexture;
//                        matMirrorGlas.envMap = equirecTexture;
//
//                        matPaint.needsUpdate = true;
//                        matWindow.needsUpdate = true;
//                        matMirror.needsUpdate = true;
//                        matChrome.needsUpdate = true;
//                        matGlas.needsUpdate = true;
//                        matAluDark.needsUpdate = true;
//                        matMirrorGlas.needsUpdate = true;
                    
//                        renderer.shadowMap.needsUpdate = true;
                        render();
            }


            function showEnvironment() 
            {
//                scene.remove(sky);
//                scene.add(blob);
//                if (blob.children[0].material.map) blob.children[0].material.map.dispose();
                renderer.shadowMap.needsUpdate = true;
//                dirLight.position.set( 120, 350, 250 );
//                plane.material.opacity = 0.7;
                if (!equirecTexture) 
                        if (!mountains) 
                        {
//                            mountains = loaderc.load( 'textures/compressed/' + currentBG + '.dds', function ( texture ) {
                            mountains = loaderTextures.load( 'textures/coast/pano.jpg', function ( texture ) {
                            texture.mapping = THREE.EquirectangularReflectionMapping;
                            texture.flipY = false;
                            texture.magFilter = THREE.LinearFilter;
                            texture.minFilter = THREE.LinearFilter;
                            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                            equirecTexture = texture;
                            updateBlob();
                            });
                        }
                        else
                            equirecTexture = mountains; 
                else
                    updateBlob();

                        

                        
  
            
                //                        scene.remove(model);
                //                        scene.remove( groundshadow );
                //                        cubeCamera.update( renderer, scene );
                //                        render();
                //                        scene.add( groundshadow );
                //                        scene.add(model);

  
            }

            function showStudio() 
            {
//                scene.remove(blob);
//                blob.visible = false;
                           
//                matPaint.envMap = sphericalTexture; 
//                matWindow.envMap = sphericalTexture; 
//                matMirror.envMap = sphericalTexture; 
//                matChrome.envMap = sphericalTexture;
//                matGlas.envMap = sphericalTexture;
//                matAluDark.envMap = sphericalTexture;
//                matMirrorGlas.envMap = sphericalTexture;
// 
//                matPaint.needsUpdate = true;
//                matWindow.needsUpdate = true;
//                matMirror.needsUpdate = true;
//                matChrome.needsUpdate = true;
//                matGlas.needsUpdate = true;
//                matAluDark.needsUpdate = true;
//                matMirrorGlas.needsUpdate = true;
                
                matBlob.color = matPaint.color;
                matBlob.map = null;
                matBlob.needsUpdate = true;
                
//                dirLight.position.set( 120, 450, 0 );
//                plane.material.opacity = 0.3;
                
                renderer.shadowMap.needsUpdate = true;
                render();
            }


            function changeColorByCode(code) 
            {
            
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

                render('changeColorByCode');
                // Update Color GUI manually
                if (_this.colorGUI) _this.colorGUI.object = _this.paintTotal[index];
                if (_this.colorGUI) _this.colorGUI.updateDisplay(); 
                
                
            }
    
    
    
            function changeRoof() 
            {
                var group;
                group = _this.scene.getObjectByName( "top" );
                var value = true;
                if (!_this.roofTop) {
                    _this.roofTop = true;  
                    group.position.set(0,0,0);
                }
                else
                {
                    _this.roofTop = false;
                    value = false;
                    group.position.set(108,-32,0); 
                }
                
                // door window
                group = _this.scene.getObjectByName( "door" );
                group.children[12].visible = value;
                group = _this.scene.getObjectByName( "door_clone" );
                group.children[12].visible = value;
                

                render('changeRoof');

            }
    
            function changeWheelStripe(num) 
            {
                switch(num){
                        case 1:
                            _this.matStripe.color.setHex( 0xFFC32B );
                            break;
                        case 2:
                            _this.matStripe.color.setHex( 0xE50004 );
                            break;
                        case 3:
                            _this.matStripe.color.setHex( 0x111111 );
                            break;
                       default:
                           break;      
                }
                
                _this.matStripe.map = createColorTexture('#' + _this.matStripe.color.getHexString());
                _this.matStripe.color.setHex( 0xffffff );
                render('changeStripesColor');
            }
    
//            function colorTo(material, value) 
//            {
//                
//                var initial = new THREE.Color(material.color.getHex());
//                var value = new THREE.Color(value);
//                
//                var positions = {color: material.color.getHex()};
//                var targets = { r: value.r, g: value.g, b: value.b };
//                
//                tweener = new TWEEN.Tween( positions ).to(
//                    targets
//                , 200).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
//                    material.color = initial;
//                }).start();
//
//            }
    
            function changeColor(num) 
            {
                var currentPaint = _this.paintPos;
                if(num == "next")
                    if (currentPaint == _this.paintTotal.length)
                        num = 1;
                    else
                        num = currentPaint + 1;
                if(num == "prev")
                    if (currentPaint == 1)
                        num = _this.paintTotal.length;
                    else
                        num = currentPaint - 1;
                _this.paintPos = num;
//                console.log(num);
                changeColorExt(num);
            }
    
            function changeCaliperColor(num) 
            {
                var currentCaliper = _this.caliperPos;
                if(num == "next")
                    if (currentCaliper == _this.caliperTotal.length)
                        num = 1;
                    else
                        num = currentCaliper + 1;
                if(num == "prev")
                    if (currentCaliper == 1)
                        num = _this.caliperTotal.length;
                    else
                        num = currentCaliper - 1;
                _this.caliperPos = num;
                console.log('_this.caliperPos ' + _this.caliperPos);
                var hexColor;
                switch(num){
                        case 1:
                            hexColor = 0xFFC32B;
                            _this.matCaliperLogo.color.setHex( 0x000000 );
                            break;
                        case 2:
                            hexColor = 0xE50004;
                            _this.matCaliperLogo.color.setHex( 0xFFFFFF );
                            break;
                        case 3:
                            hexColor = 0x000000;
                            _this.matCaliperLogo.color.setHex( 0xFFFFFF );
                            break;
                        case 4:
                            hexColor = 0x777777;
                            _this.matCaliperLogo.color.setHex( 0xFFFFFF );
                            break;
                       default:
                           break;      
                }
                
                _this.matCaliper.color.setHex( hexColor );
                _this.matCaliper.map = createColorTexture('#' + _this.matCaliper.color.getHexString());
                _this.matCaliper.color.setHex( 0xffffff );
                
                render('changeCaliperColor');
            }
    
            
            function changeColorExt(num) 
            {
//                if (!mouseDown)
//                {
               
                
//                if (num == 1)
//                {
//                    chromeParts.children[2].material = matPrimer;
//                    chromeParts.children[3].material = matMirror;
//                    chromeParts.children[4].material = matMirror;
//                    chromeParts.children[6].material = matPrimer;
//                    chromeParts.children[7].material = matMirror;
//                    gdoorDriver.children[0].material = matMirror;
//                    gdoorCoDriver.children[0].material = matMirror;
//                    gdoorDriver.children[8].material = matMirror;
//                    gdoorCoDriver.children[8].material = matMirror;
//                    grearDoorDriver.children[0].material = matMirror;
//                    grearDoorCoDriver.children[0].material = matMirror;
//                }
//                else
//                {
//                    chromeParts.children[2].material = matChrome;
//                    chromeParts.children[3].material = matChrome;
//                    chromeParts.children[4].material = matChrome;
//                    chromeParts.children[6].material = matChrome;
//                    chromeParts.children[7].material = matChrome;
//                    gdoorDriver.children[0].material = matPaint;
//                    gdoorCoDriver.children[0].material = matPaint;
//                    gdoorDriver.children[8].material = matChrome;
//                    gdoorCoDriver.children[8].material = matChrome;
//                    grearDoorDriver.children[0].material = matChrome;
//                    grearDoorCoDriver.children[0].material = matChrome;
//                }
                 
                
//                matPaint.color.value.setHex(paintTotal[num - 1]);
//                matPaint.color.value.setHex(paintTotal[num - 1]);
//                matPaint.color = paintTotal[num - 1];
//                matPaint.color.setHex( paintTotal[num - 1] );
                
                _this.matPaint.color.setHex( _this.paintTotal[num - 1].color );
                // Map canvas texture to avoid gamma correction for colors
                _this.matPaint.map = createColorTexture('#' + _this.matPaint.color.getHexString());
                //Reset color value to white color
                _this.matPaint.color.setHex( 0xffffff );
                
                _this.physicalMaterial.roughness = _this.matPaint.roughness = _this.paintTotal[num - 1].roughness;
                _this.physicalMaterial.metalness = _this.matPaint.metalness = _this.paintTotal[num - 1].metalness;
                _this.physicalMaterial.clearCoat = _this.matPaint.clearCoat = _this.paintTotal[num - 1].clearCoat;
                _this.physicalMaterial.clearCoatRoughness = _this.matPaint.clearCoatRoughness = _this.paintTotal[num - 1].clearCoatRoughness;
                _this.physicalMaterial.reflectivity = _this.matPaint.reflectivity = _this.paintTotal[num - 1].reflectivity;
                _this.physicalMaterial.envMapIntensity = _this.matPaint.envMapIntensity = _this.paintTotal[num - 1].envMapIntensity;
//                physicalMaterial.clearCoatRoughness = matPaint.clearCoatRoughness = paintTotal[num - 1].clearCoatRoughness;
                

//            cubeCamera.update( renderer, scene );

                _this.paintPos = num;

                // Update Color GUI manually
                if (_this.colorGUI) _this.colorGUI.object = _this.paintTotal[_this.paintPos - 1];
                if (_this.colorGUI) _this.colorGUI.updateDisplay(); 
                
                if (_this.envGUICurrent == 'reflection006')
                    {
                        _this.matBlob.map = createColorTexture(_this.paintTotal[_this.paintPos - 1].color);
                        _this.matBlob.color.setHex( 0xffffff );
                        _this.matBlob.needsUpdate = true;
                    }

                
                render('changeColorExt');
                
//                }
            }

            function changeEnvironment2(num)
            {
                assignMaterials(_this.model);
                _this.matPaint.color.setHex( 0xffffff );
                render('assignMaterials');
            }
                
            function changeEnvironment(num)
            {
//                _this._reflection = '006';
                var currentEnv = _this.envPos;
//                envGUICurrent = envGUIArray[0];
                if(num == "next" || num == undefined)
                    if (currentEnv == _this.envGUIArray.length - 1)
                        num = 0;
                    else
                        num = currentEnv + 1;
                else if(num == "prev")
                    if (currentEnv == 0)
                        num = _this.envGUIArray.length - 1;
                    else
                        num = currentEnv - 1;
                _this.envPos = num;
                console.log("changeEnvironment " + _this.envPos);
                _this.envGUICurrent = _this.envGUIArray[_this.envPos];
                console.log(_this.envGUICurrent);
                
//                if (envPos == 4)
//                    dirLight.add( lensflare );
//                else
//                   dirLight.remove( lensflare ); 
//                renderer.shadowMap.needsUpdate = true;
                if (_this.envGUICurrent != 'reflection000' && _this.envGUICurrent != 'reflection006'){ // 
                    
//                    var env = _this.loaderTextures.load( 'textures/' + _this.envGUICurrent + '/pano.jpg', function ( texture ) {
                    var env = _this.loaderEnv.load( 'textures/' + _this.envGUICurrent + '/pano_' + _this.textureformat + '.ktx', function ( texture ) {
                        
                     
//                    texture.mapping = THREE.EquirectangularReflectionMapping;
//                    texture.flipY = true; // Doesn't work with compressed textures!!
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.anisotropy = _this.renderer.capabilities.getMaxAnisotropy();
                    _this.matBlob.map = texture;
                    _this.matBlob.color.setHex( 0xffffff );
                    _this.matBlob.needsUpdate = true;
                    _this.controls.minPolarAngle = THREE.Math.degToRad(0); // radians Math.radians(-90);
                    _this.controls.maxPolarAngle = THREE.Math.degToRad(78);
                        
                    _this.plane.material.opacity = 0.65;
                        
                        if (_this.envGUICurrent == 'reflection010')
                            _this.dirLight.position.set( -280, 230, 30 );
                        else
                            _this.dirLight.position.set( 60, 300, 180 );
                        
                        loadHDRReflection(_this.envGUICurrent);
                        
                        _this.blob.visible = true;
                        
                    });
                    
                    
                }
                else
                {
//                    _this.matBlob.map = createColorTexture(_this.paintTotal[_this.paintPos - 1].color);
//                     _this.matBlob.color.setHex( 0xffffff );
//                     _this.matBlob.needsUpdate = true;

                    _this.controls.minPolarAngle = THREE.Math.degToRad(0); // radians Math.radians(-90);
                    _this.controls.maxPolarAngle = THREE.Math.degToRad(78);
                    
                    _this.plane.material.opacity = 0.35;
                    
                    _this.dirLight.position.set( 47, 400, 0 );
                    
                    loadHDRReflection(_this.envGUICurrent);
                    
                    if (_this.envGUICurrent == 'reflection000')
                        _this.blob.visible = false;
                    else
                        _this.blob.visible = true;
                    
                     
                }
                
                
                
                

                
//                changeColorExt(num);
                
//                if (environment == 'studio')
//                    {
////                        dirLight.position.set( -500, 650, 400 );
////                        scene.add( dirLight );
////                        camera.add( directionalLight );
////                        directionalLight.intensity = 0.75;
////                        ambient.intensity = 1.0;
//
//                        showEnvironment();
//                        environment = 'real';
//                    }
//                else
//                    {
////                        dirLight.position.set( 120, 450, 0 );
////                        camera.add( dirLight );
////                        camera.remove( directionalLight ); // Performance issues!
////                        directionalLight.intensity = 0;
////                        ambient.intensity = 2.0;
//                        showStudio();
//                        environment = 'studio';
//                    }
//                renderer.shadowMap.needsUpdate = true;
//                render();
            }

            function changeColor(num) 
            {
                var currentPaint = _this.paintPos;
                if(num == "next")
                    if (currentPaint == _this.paintTotal.length)
                        num = 1;
                    else
                        num = currentPaint + 1;
                if(num == "prev")
                    if (currentPaint == 1)
                        num = _this.paintTotal.length;
                    else
                        num = currentPaint - 1;
                _this.paintPos = num;
//                console.log(num);
                changeColorExt(num);
            }
    
        
            function changeBrake(num) 
            {
               
                var currentBrake = _this.brakePos;
                if(num == "next")
                    if (currentBrake == _this.brakeTotal.length)
                        num = 1;
                    else
                        num = currentBrake + 1;
                if(num == "prev")
                    if (currentBrake == 1)
                        num = _this.brakeTotal.length;
                    else
                        num = currentBrake - 1;

                switch(num)
                {
                    case 1:
                        loadGLTF('j56_front');
                        loadGLTF('j56_rear');
                        break;
                    case 2:
                        loadGLTF('j57_front');
                        loadGLTF('j57_rear');
                        break;
                   default:
                       break;      
               }
                
                _this.brakePos = num;
                
            }

            function changeWheel(num) 
            {
               
                var currentWheel = _this.wheelPos;
                if(num == "next")
                    if (currentWheel == _this.wheelTotal.length)
                        num = 1;
                    else
                        num = currentWheel + 1;
                if(num == "prev")
                    if (currentWheel == 1)
                        num = _this.wheelTotal.length;
                    else
                        num = currentWheel - 1;
//                alert(num);
//                spinner.classList.remove('hide');
                //["q6x","q8u"];
                switch(num){
                            case 1:
                                loadGLTF('q8u');
                                break;
                            case 2:
                                loadGLTF('q6x');
                                changeWheelStripe(3);
                                if (_this.copyMaterial) _this.matAlloyDark.copy(_this.copyMaterial);
                                break;
                            case 3:
                                loadGLTF('q6x');
                                changeWheelStripe(1);
                                if (_this.copyMaterial) _this.matAlloyDark.copy(_this.copyMaterial);
                                break;
                            case 4:
                                loadGLTF('q6x');
                                changeWheelStripe(2);
                                if (_this.copyMaterial) _this.matAlloyDark.copy(_this.copyMaterial);
                                break;
                            case 5:
                                loadGLTF('q6x');
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

            function moveHandler(event){

//                console.log("MOVE! " + event.clientX + ", " + event.clientY); 

                if (_this.mouseDown)
                    _this.aa = false;
                
                var mouse = new THREE.Vector2();
                mouse.x = ( event.clientX / _this.SCREEN_WIDTH ) * 2 - 1;
                mouse.y = - ( event.clientY / _this.SCREEN_HEIGHT ) * 2 + 1; 
                
                _this.raycaster.setFromCamera( mouse, _this.cameraHUD );
                
                var intersects = _this.raycaster.intersectObjects( _this.touchables );
                if (intersects.length != 0)
                {
                    document.body.style.cursor = 'pointer';
//                    effectGrayScale.enabled = true;
//                    ssaoRenderPassP.enabled = true;
//                    ssaoRenderPassP.onlyAO = true;
//                    effectGrayScale.enabled = true;
//                    render('moveHandler');
                }
                else
                {
//                    effectGrayScale.enabled = false;
//                    effectGrayScale.enabled = false;
                    document.body.style.cursor = '';
//                    render('moveHandler');
                }
//                console.log(hotspotTouchDown);
            }

            function touchdownHandler(event){

//                console.log("DOWN! " + event.clientX + ", " + event.clientY); 
                
                _this.pressMouseDown.x = ( event.clientX / _this.SCREEN_WIDTH ) * 2 - 1;
                _this.pressMouseDown.y = - ( event.clientY / _this.SCREEN_HEIGHT ) * 2 + 1; 
                
                _this.raycaster.setFromCamera( _this.pressMouseDown, _this.cameraHUD );
                
                var intersects = _this.raycaster.intersectObjects( _this.touchables );
                _this.hotspotTouchDown = undefined;
                
                intersects.forEach(function(element){
                   _this.hotspotTouchDown = element.object.name; 
                });
//                console.log('Hotspot Name: ' + _this.hotspotTouchDown);
            }
                                   
            function touchupHandler(event){
                
//                console.log("UP! " + event.clientX + ", " + event.clientY);      

                var mouse = new THREE.Vector2();
                mouse.x = ( event.clientX / _this.SCREEN_WIDTH ) * 2 - 1;
                mouse.y = - ( event.clientY / _this.SCREEN_HEIGHT ) * 2 + 1; 
                
                _this.raycaster.setFromCamera( mouse, _this.cameraHUD );   

                var intersects = _this.raycaster.intersectObjects( _this.touchables );
                if (intersects.length == 0 && _this.pressMouseDown.x == mouse.x && _this.pressMouseDown.y == mouse.y )
                {
//                    if (hotspots.visible)
//                        hotspots.visible = false;
//                    else
//                        hotspots.visible = true; 
//                    if (!controls.enabled) 
//                        hotspot_spin.visible = true;
                    render('touchupHandler');
                }
//                        {
//                            fadeHotspots(0);
//                        }
                intersects.forEach(function(element){
                 
                    
                        if (_this.hotspotTouchDown == element.object.name)
                        {
                            _this.lastClickedSpot = element.object.name;
//                            console.log(element.object.name);
//                                hotspots.visible = false;
//                                controls.enabled = false;
                            if (element.object.name == 'color')
                            {
                                changeColor('next');
                            }
//                            else if (element.object.name == 'spin')
//                            {
//                                _this.controls.enabled = true;
//                                _this.hotspots.visible = false;
//                                _this.hotspot_spin.visible = false;
//                                render('touchupHandler');
//                            }
                            else if (element.object.name == 'wheel')
                            {
                                changeWheel('next');
                            }
                        }
                        
                    
                });
            }

            function castRays(sprite) {
            
                // rays
                
                sprite.visible = true;

                var direction = sprite.position.clone();
            
                var startPoint = _this.camera.position.clone();

                var directionVector = direction.sub( startPoint );

                var ray = new THREE.Raycaster(startPoint, directionVector.clone().normalize());

                _this.scene.updateMatrixWorld(); // required, since you haven't rendered yet

                var rayIntersects = ray.intersectObject(_this.objCube, true);

                if (rayIntersects[0] && rayIntersects[0].distance < directionVector.length()) {
//                    console.log(rayIntersects[0]);
                    
                    sprite.visible = false;

//                    var material = new THREE.LineBasicMaterial({
//                      color: 0x0000ff
//                    });
//                    var geometry = new THREE.Geometry();
//                    geometry.vertices.push(new THREE.Vector3(ray.ray.origin.x, ray.ray.origin.y, ray.ray.origin.z));
//                    geometry.vertices.push(new THREE.Vector3(0, 200, -200));
//                    var line = new THREE.Line(geometry, material);
//                    sceneSprites.add( line );

                }
            }

            function positionTrackingOverlay()
            {
                var visibleWidth, visibleHeight, p, v, percX, percY, left, top, translate3d;
                var sprite, clone;

                p = new THREE.Vector3();
 
                for( var j = _this.sceneHUD.children.length - 1; j >= 0; j--) 
                {
                    _this.sceneHUD.remove(_this.sceneHUD.children[j])
                }

                _this.touchables = [];
                for ( var i = 0, l = _this.hotspots.children.length; i < l; i ++ ) {

                    sprite = _this.hotspots.children[ i ];
                    
                    p.setFromMatrixPosition(sprite.matrixWorld);
                    v = p.project(_this.camera);
                    percX = (v.x + 1) / 2;
                    percY = (v.y + 1) / 2;
                    left = percX * _this.SCREEN_WIDTH;
                    top = percY * _this.SCREEN_HEIGHT;
                    
                    castRays(sprite);

                    if (sprite.visible) 
                    {
                        var spot = _this['hotspot_'+sprite.name];
                        spot.position.set( left, top, 1 );
                        spot.scale.set( 60, 60, 1 );
                        console.log(spot);
                        _this.sceneHUD.add( spot );
                        _this.touchables.push( spot ); 

                    }  
                    

				}

                
    
            }

            function resizeFrame(_width, _height) {
                
                window.setTimeout(function() {window.scrollTo(0,0);}, 0);
              
//                if (_width)
//                {
//                    SCREEN_WIDTH = _width;
//                    SCREEN_HEIGHT = _height;    
//                }
//                else
//                {
//                    SCREEN_WIDTH = window.innerWidth;
//                    SCREEN_HEIGHT = window.innerHeight; 
//                }
                _this.SCREEN_WIDTH = window.innerWidth;
//                if (!check)
//                    SCREEN_HEIGHT = Math.round(SCREEN_WIDTH/2.75);
//                else
                   _this.SCREEN_HEIGHT = window.innerHeight;  

				_this.camera.aspect = _this.SCREEN_WIDTH / _this.SCREEN_HEIGHT;
                _this.camera.updateProjectionMatrix();
                
                _this.cameraHUD.left = 0;
				_this.cameraHUD.right = _this.SCREEN_WIDTH;
				_this.cameraHUD.top = _this.SCREEN_HEIGHT;
				_this.cameraHUD.bottom = 0;
                _this.cameraHUD.updateProjectionMatrix();

				_this.renderer.setSize( _this.SCREEN_WIDTH, _this.SCREEN_HEIGHT );

                _this.composer.setSize( _this.SCREEN_WIDTH*2.5, _this.SCREEN_HEIGHT*2.5 );
//                postprocessing.composer.setSize( SCREEN_WIDTH*2, SCREEN_HEIGHT*2 );
//                
                render('Resize');
//                if(_this.timerResize !== null) {
//                    clearTimeout(_this.timerResize);        
//                }
//                _this.timerResize = setTimeout(function() {
//                        _this.aa = true;
//                        render('Resize_timeout');
//                }, 350);
                

			}

            function initPostprocessing() {
                
                
                _this.renderPass = new THREE.RenderPass(_this.scene, _this.camera);
                _this.renderPass.renderToScreen = false;

                var parameters = {
					minFilter: THREE.LinearFilter,
					magFilter: THREE.LinearFilter,
					format: THREE.RGBAFormat,
					stencilBuffer: false
				};

                var renderTarget = new THREE.WebGLRenderTarget( _this.SCREEN_WIDTH, _this.SCREEN_HEIGHT, parameters );

                _this.composer = new THREE.EffectComposer(_this.renderer, renderTarget);
                
//                _this.composer.setSize( _this.SCREEN_WIDTH*2.5, _this.SCREEN_HEIGHT*2.5 );
                
                _this.copyShader = new THREE.ShaderPass(THREE.CopyShader);
                _this.copyShader.renderToScreen = true;
                _this.copyShader.enabled = true;

                _this.ssaaRenderPassP = new THREE.SSAARenderPass( _this.scene, _this.camera );

                _this.ssaaRenderPassP.clearColor = _this._clearColor; //0x7F7F7F;
				_this.ssaaRenderPassP.clearAlpha = 0;
				if (!_this.check)
                    _this.ssaaRenderPassP.sampleLevel = 2; // 2
                else
                    _this.ssaaRenderPassP.sampleLevel = 1;
				_this.ssaaRenderPassP.unbiased = true;
				_this.ssaaRenderPassP.enabled = true;

            
                _this.composer.addPass(_this.renderPass);
                _this.composer.addPass(_this.ssaaRenderPassP);
                _this.composer.addPass(_this.copyShader);

			}

			function animate(time) {

				requestAnimationFrame( animate );

                TWEEN.update(time);
                
                _this.controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
//                controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

//                var delta = clock.getDelta();
//				groundMirrorMaterial.updateFrame( delta );
                
				if (_this.stats) _this.stats.update();

                if (_this.rotateDir == 'left')
                    _this.model.rotation.y -= _this.SPEED * 2;
                else if (_this.rotateDir == 'right')
                    _this.model.rotation.y += _this.SPEED * 2;
                
//                paramsCam.positionX = camera.position.x;
//                paramsCam.positionY = camera.position.y;
//                paramsCam.positionZ = camera.position.z;
//                
//                paramsCam.orbitX = controls.target.x;
//                paramsCam.orbitY = controls.target.y;
//                paramsCam.orbitZ = controls.target.z;
//                
//                paramsCam.fov = camera.fov;
                
//                _this.dirLight.target.position.set(_this.camera.position.x,_this.camera.position.y,_this.camera.position.z);
                
//                paramsModel.rotationY = model.rotation.y;
//                paramsModel.wheelPositionY = pivotWheelFL.rotation.y;

                if (_this.mouseDown || _this.isRunningAnim || _this.isRunningCam || _this.isRunningWheel)
                    render('animate');
//                else
//                   composer.render(); 

			}


			function render(func) {

//                console.log('RENDER: ' + func);
//                console.log(_this.hotspots.visible);
//                console.log(_this._hotspots);

                if (_this.hotspots.visible && _this._hotspots) 
                {
                    _this.objCube.visible = true;
                    _this.renderer.render(_this.sceneSprites, _this.camera);
                    positionTrackingOverlay();
                }
                if (_this._hotspots) _this.objCube.visible = false;
                
//                console.log(_this.camera.position);
//                console.log(_this.controls.target);
//                
//                console.log(_this.controls.getPolarAngle());
//                console.log(_this.controls.getAzimuthalAngle());
//                console.log(_this.controls.object.position.distanceTo( _this.controls.target ));
//                const polarAngle = controls.getPolarAngle();
//                const azimuthalAngle = controls.getAzimuthalAngle();
//                const distance = controls.object.position.distanceTo( controls.target );
//                _this.renderer.info.autoReset = false;
//                _this.renderer.info.reset();
//                console.log(_this._antialias);
//                if (this._antialias)
//                {
                    if (_this.aa && _this._antialias != 'none' || _this._antialias == 'always')
                    {
//                        console.log('WHAT???RENDER! ' + func);
    //                    effectGrayScale.enabled = false;
    //                    ssaoRenderPassP.enabled = true;
//                        _this.dirLight.enabled = true;
//                        _this.camera.add( _this.dirLight );
//                        _this.renderer.shadowMap.needsUpdate = true;
//                        _this.renderPass.renderToScreen = false;
//                        _this.copyShader.enabled = true;
//                        _this.ssaaRenderPassP.enabled = true;
//                        
                        _this.composer.render();
//                        _this.renderer.render(_this.scene, _this.camera);
//                        console.log(_this.renderer.info);
//                        console.log(_this.renderer.info.render.calls);
//                        

//                            ssaaRenderPassP.sampleLevel = 2;
                    }
                    else
                    {

    //                    renderer.render(scene, camera);
    //                    effectGrayScale.enabled = true;
    //                    ssaoRenderPassP.enabled = false;
//                        _this.dirLight.enabled = false;
//                        _this.camera.remove( _this.dirLight );
                        
////                        _this.renderPass.renderToScreen = true;
//                        _this.copyShader.enabled = false;
//                        _this.ssaaRenderPassP.enabled = false;
                        
//                        ssaaRenderPassP.sampleLevel = 1;

//                        _this.renderer.info.reset();
                        _this.renderer.render(_this.scene, _this.camera);
//                        console.log(_this.renderer.info);


                    }
                
//                }
//                renderer.clear();
//                _this.renderer.info.reset();
//                _this.composer.render();
                 

//                if (_this.hotspots.visible && _this._hotspots) 
//                {
//                    _this.renderer.render(_this.sceneHUD, _this.cameraHUD);
//                }
                
               
			}
    
    // expose API (public methods)

        return { 


            setTrunk: function(){

               animateLid();    

            },
            
            setDoors: function(){

               animateDoors();    

            },
            
            setRoof: function(){

               changeRoof();    

            },
            
            setColor: function(_code){

               changeColorByCode(_code);    

            },
            
            setCaliperColor: function(_code){

               switch(_code) {
                  case 'yellow':
                    changeCaliperColor(1);
                    break;
                case 'red':
                    changeCaliperColor(2);
                    break;
                case 'black': 
                    changeCaliperColor(3);
                    break;
                  case 'grey': 
                    changeCaliperColor(4);
                    break;
              }

            },

            setWheel: function(_code){

//                alert(_code)
                switch(_code) {
                    case 1:
                    changeWheel(1);
                    break;
                    case 2:
                    changeWheel(2);
                    break;
                }   

            },
            
            prevBrake: function() {

              changeBrake('prev');
            },
            
            nextBrake: function() {

              changeBrake('next');
            },
            
            prevWheel: function() {

              changeWheel('prev');
            },
            
            nextWheel: function() {

              changeWheel('next');
            },
            
            
            prevEnvironment: function() {

              changeEnvironment('prev');
            },
            
            nextEnvironment: function() {

              changeEnvironment('next');
            },

            setConfiguration: function(_config) {

            },
            
//            changeColor('next');

            prevCaliperColor: function() {

              changeCaliperColor('prev');
            },
            
            nextCaliperColor: function() {

              changeCaliperColor('next');
            },
            
            prevColor: function() {

              changeColor('prev');
            },
            
            nextColor: function() {

              changeColor('next');
            },
            
            prevCamera: function(dir = '+') {

              if (dir == '-') 
                 nextCamera();
              else
                 prevCamera();
            },

            nextCamera: function(dir = '+') {

              if (dir == '-') 
                 prevCamera();
              else
                 nextCamera();

            },

            setCamera: function(_camera) { 

            //              console.log(_camera);
              switch(_camera) {
                  case 'interior':
                    changeCamera(0);
                    break;
                case 'front_right':
                    changeCamera(1);
                    break;
                case 'side_left': 
                    changeCamera(5);
                    break;
                  case 'rear_right': 
                    changeCamera(2);
                    break;
                case 'rear_left': 
                    changeCamera(4);
                    break;
                case 'rear': 
                    changeCamera(3);
                    break;
                case 'front': 
                    changeCamera(6);
                    break;
              }

            }

            }
    
}