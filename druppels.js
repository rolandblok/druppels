function init() {
  druppels = new Druppels("druppels");
  druppels.animLoop();
}

var settings = {};
settings.g = 9.8;
settings.drop_interval_ms = 1000;
settings.drop_offset_y = 200;
settings.drop_height   =  5;
settings.radius        =  0.1;
settings.ground_z      = -5;
settings.droppers      =  10;
settings.drop_rows     =  10;


class Druppels {

  constructor(name) {

      this.name = name;
 
      this.canvas = document.getElementById("canvas");
      this.canvas.addEventListener("mousedown", this, false);
      this.canvas.addEventListener("mouseup", this, false);
      this.canvas.addEventListener("mousemove", this, false);
      this.canvas.addEventListener("click", this, false);
      this.canvas.addEventListener("dblclick", this, false);
      //this.canvas.addEventListener("resize", this, false);

      this.canvas.addEventListener('keydown', this, false);
      this.canvas.addEventListener('keyup', this, false);
      this.canvas.addEventListener('wheel', this, false);
      let me = this // this is the-javascript-shiat!  https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
      window.addEventListener( 'resize', function bla(event) {
                console.log("resize " + me.name)
                me.THREEcamera.aspect = window.innerWidth / window.innerHeight;
                me.THREEcamera.updateProjectionMatrix();
                me.renderer.setSize(window.innerWidth, window.innerHeight);
              }, false );

      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      this.gui = new dat.GUI();
      this.gui_speeds = this.gui.addFolder('settings')

      this.pause = false;

      //this.gui_speeds.add(settings, "g").min(1);
      this.gui_speeds.add(settings, "radius").min(0.1);
      this.gui_speeds.add(settings, "drop_interval_ms").min(100)
      
      this.gui_speeds.add(settings, "droppers").min(2)
      this.gui_speeds.add(settings, "drop_rows").min(2);
      this.gui_speeds.open();


      // THREE / GL
      this.three_scene = new THREE.Scene();

      this.fov = 55
      this.THREEcamera = new THREE.PerspectiveCamera( this.fov, 1.33, 0.01, 2000 );
      
      this.THREEcamera.up = new THREE.Vector3(0,   0,   1)
      this.THREEcamera.aspect = window.innerWidth / window.innerHeight;
      this.THREEcamera.fov = this.fov
      this.THREEcamera.position.set(0, -15, 0)
      this.THREEcamera.lookAt(new THREE.Vector3(0,   0,  0))
      this.THREEcamera.updateProjectionMatrix();
      this.back_color = 0x000000

      this.three_light = new THREE.PointLight( "ffffff", 1, 0 )
      this.three_light.position.set(-10, -10, -10)
      
      this.three_scene.add( this.three_light );

      this.raycaster = new THREE.Raycaster(); 


      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas_g, antialias: true, depth: true});
      this.renderer.setSize( window.innerWidth, window.innerHeight);
      this.canvas = document.body.appendChild(this.renderer.domElement);
      
      this.druppels = {};
      this.druppel_cntr = 0;
        
     
      this.last_update_time_ms = null;
      this.last_drop_time_ms = 0;

  }

  animLoop(cur_time_ms) {
    var me = this; // https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
    //window.requestAnimationFrame(function (cur_time) { me.drawAndUpdate(cur_time); });

    this.stats.begin();

    //update
    if ((this.last_update_time_ms != null) && !this.pause ) {
      var d_time_ms = cur_time_ms - this.last_update_time_ms

      // extra drops
      if ( (cur_time_ms - this.last_drop_time_ms) > settings.drop_interval_ms ) {

        var x_step = 10 / (settings.droppers-1);
        for (let dx = 0; dx < settings.droppers; dx++ ) {
          var x = -5 + dx*x_step;

          var y_step = 10 / (settings.drop_rows-1)
          for (let dy = 0; dy < settings.drop_rows; dy++) {
            var y = -5 + dy*y_step;
            
            var drup_id = this._genID();
            this.druppels[drup_id] = new Druppel(this.three_scene, settings, drup_id, x, y, settings.drop_height, settings.radius) ;
            
          }
        }

        this.last_drop_time_ms = cur_time_ms
      }

      // update the drops
      for (var druppel of Object.values(this.druppels)) {
        druppel.update(d_time_ms);

        if (druppel.z < settings.ground_z) {
          druppel.delete();
          delete this.druppels[druppel.drup_id];
        }
      }

      // ground hit : remove

    }


    this.last_update_time_ms = cur_time_ms;

    // draw
    window.requestAnimationFrame(function (cur_time) { me.animLoop(cur_time); });
    this.render();

    this.stats.end();

  }

  render() {
    
    this.renderer.render(this.three_scene, this.THREEcamera)

  }
      



  _raycastMouseToTile(e){
    // some raycasting to deterimine the active tile.
    this.mouse_position.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse_position.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse_position, this.camera.THREEcamera);
    var intersects = this.raycaster.intersectObjects( this.three_scene.children );

    return intersects.map(x => x.object.name);
  }


  onmousemove(e) {
    //console.log(" onmousemove : " + e.x + " " + e.y)
    console.log(" onmousemove : ")
  }

  onmousedown(e) {
    console.log(" onmousedown : " + e.x + " " + e.y)
    this.pause = !this.pause;
  }
  onmouseup(e) {
    console.log(" onmouseup : " + e.x + " " + e.y)
    // var game_object_ids = this._raycastMouseToTile(e);
  }

  keyDown(e){
    console.log(" keyDown : "+ e.x + " " + e.y)
  }

  keyUp(e){
    console.log(" keyUp : "+ e.x + " " + e.y)
  }

  wheel(e){
      console.log(" w " + e.deltaX + " " + e.deltaY + " " + e.deltaZ + " " + e.deltaMode)
  }

  handleEvent(evt) {
      //console.log("event type " + evt.type)
      switch (evt.type) {
          case "wheel":
              this.wheel(evt);
              break;
          case "keydown":
              this.keyDown(evt)
              break;
          case "mousemove":
              //mouse move also fires at click...
              this.onmousemove(evt);
              break;
          case "mousedown":
              this.onmousedown(evt);
              break;
          case "mouseup":
              this.onmouseup(evt);
              break;
          case "dblclick":
              break;
          case "keydown":
              this.keyDown(evt);
              break;
          case "keyup":
              this.keyUp(evt);
              break;
          default:
              return;
      }
  }

  _genID() {
    this.druppel_cntr ++
    return this.druppel_cntr 
  }
}
