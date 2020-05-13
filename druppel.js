
class Druppel {
    constructor (three_scene, settings, drup_id, x,y,z, _radius) {

        let material = new THREE.MeshPhongMaterial( {color:"#00ff00"} );
        let geometry = new THREE.SphereBufferGeometry(1, 8 , 8);
        this.three_mesh = new THREE.Mesh( geometry, material );
        this.three_mesh.position.set(x, y, z)

        this.three_mesh.scale.x = _radius
        this.three_mesh.scale.y = _radius
        this.three_mesh.scale.z = _radius

        this.three_scene = three_scene;
        three_scene.add(  this.three_mesh );    

        this.drup_id = drup_id;
        this.settings = settings;
        this.speed = 0;

    }

    update (dt_ms) {
        // TODO https://en.wikipedia.org/wiki/Terminal_velocity
        //console.log("rolnd " + 0.000001* dt_ms)
        this.three_mesh.position.z -= 0.001* dt_ms;
    }
    get z() {
        return this.three_mesh.position.z
    }
    delete () {
        this.three_scene.remove(this.three_mesh)
    }
}            