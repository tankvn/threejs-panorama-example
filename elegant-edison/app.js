console.log('update 1');
var camera, scene, renderer;

var isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;

init();
animate();

function init() {

    var container, mesh;

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    const texture = new THREE.TextureLoader().load( 'images/screenshot.jpg' );
    var material = new THREE.MeshBasicMaterial( {
        map: texture
    } );

    mesh = new THREE.Mesh( geometry, material );

    var geometry2 = new THREE.SphereGeometry( 500, 60, 40 );
    geometry2.scale( - 1, 1, 1 );

    const texture1 = new THREE.TextureLoader().load( 'images/Worktop1.png' );
    const texture2 = new THREE.TextureLoader().load( 'images/Worktop2.png' );
    const texture3 = new THREE.TextureLoader().load( 'images/Worktop3.png' );

    var material2 = new THREE.MeshBasicMaterial( {
        map: texture1
    } );
    material2.transparent = true;
    mesh2 = new THREE.Mesh( geometry2, material2 );

    scene.add( mesh, mesh2 );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );

    //

    document.addEventListener( 'dragover', function ( event ) {

        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

    }, false );

    document.addEventListener( 'dragenter', function ( event ) {

        document.body.style.opacity = 0.5;

    }, false );

    document.addEventListener( 'dragleave', function ( event ) {

        document.body.style.opacity = 1;

    }, false );

    document.addEventListener( 'drop', function ( event ) {

        event.preventDefault();

        var reader = new FileReader();
        reader.addEventListener( 'load', function ( event ) {

            material.map.image.src = event.target.result;
            material.map.needsUpdate = true;

        }, false );
        reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

        document.body.style.opacity = 1;

    }, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

    //Change conf
    changeConf = (nbr) => {
        document.getElementsByClassName('active')[0].classList.remove('active');
        if (nbr === 1) {
            material2.map = texture1;
            document.getElementById('conf1').classList.add('active');
        }
        else if (nbr === 2) {
            material2.map = texture2;
            document.getElementById('conf2').classList.add('active');
        }
        else if (nbr === 3) {
            material2.map = texture3;
            document.getElementById('conf3').classList.add('active');
        }
        material2.map.needsUpdate = true;
    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

function onDocumentMouseMove( event ) {

    if ( isUserInteracting === true ) {

        lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

    }

}

function onDocumentMouseUp( event ) {

    isUserInteracting = false;

}

function onDocumentMouseWheel( event ) {

    camera.fov += event.deltaY * 0.05;
    camera.updateProjectionMatrix();

}

function animate() {

    requestAnimationFrame( animate );
    update();

}

function update() {

    if ( isUserInteracting === true ) {

        lon += 0.1;

    }

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( camera.target );

    /*
    // distortion
    camera.position.copy( camera.target ).negate();
    */

    renderer.render( scene, camera );

}

