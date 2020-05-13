
class Druppel {
    constructor (three_scene, settings, x,y,z, _radius) {

        let material = new THREE.MeshPhongMaterial( {color:"#00ff00"} );
        let geometry = new THREE.SphereBufferGeometry(1, 32 , 32);
        this.three_mesh = new THREE.Mesh( geometry, material );
        this.three_mesh.position.set(x, y, z)

        this.three_mesh.scale.x = _radius
        this.three_mesh.scale.y = _radius
        this.three_mesh.scale.z = _radius

        three_scene.add(  this.three_mesh );    

        this.settings = settings;
        this.speed = 0;

    }

    update (dt_ms) {
        //console.log("rolnd " + 0.000001* dt_ms)
        this.three_mesh.position.z -= 0.001* dt_ms;
    }
}            