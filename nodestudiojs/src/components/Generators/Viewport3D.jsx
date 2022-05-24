import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls" 

const datasetToPointCloud = (dataset) => {

    const width = dataset.shape[1];
    const height = dataset.shape[0];
    const pointCloud = [];
    for (var i = 0; i < width * height; i++) {
        const value = dataset.pixelArray[i];
        if(value !== 0) {
            const x = i % width;
            const y = -Math.floor(i / width);
            pointCloud.push({x,y});
        }
    }

    return pointCloud;
}

var camera, scene, renderer;
var geometry, material, mesh;
  
const Viewport3D = ({dataset, drawUpdate}) => {
    const ref = useRef();
    const controls = useRef();
    const viewport = useRef({});
    const boxDict = useRef({});

    useEffect(()=>{
        init();
        animate();
    }, [])
    
    useEffect(() => {
        console.log('drawUpdate')
        update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawUpdate])

    const update = () => {
        const xOffset = dataset.shape[1] / 2;
        const yOffset = dataset.shape[0] / 2;
        const pointCloud = datasetToPointCloud(dataset);
        pointCloud.forEach((p) => {
            if(boxDict.current[p.x +'-'+ p.y] === undefined) {
                geometry = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
                material = new THREE.MeshNormalMaterial();
                mesh = new THREE.Mesh( geometry, material );
                mesh.position.set(p.x - xOffset, p.y+yOffset, 0);
                viewport.current.scene.add( mesh );
                boxDict.current[p.x +'-'+ p.y] = mesh;
            }
        });
    }

    const init = () => {
        var width = ref.current.clientWidth;
        var height = ref.current.clientHeight;

        camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 );     
        camera.position.z = 50;

        scene = new THREE.Scene();
        viewport.current.scene = scene;
        
        geometry = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        scene.add( mesh );
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( ref.current.offsetWidth, ref.current.offsetHeight );
        ref.current.appendChild( renderer.domElement );

        controls.current = new OrbitControls( camera, renderer.domElement );
        controls.current.update();
    }
    
    const animate = () => {
        requestAnimationFrame( animate );
        if(controls.current) controls.current.update();
        renderer.render( scene, camera );
    }

    return (
        <div className="viewport-3d" style={{width:'100%', height:'600px'}} ref={ref}>
        </div>
    )
}

export default Viewport3D;