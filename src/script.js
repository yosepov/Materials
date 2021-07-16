import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// Debugging
const gui = new dat.GUI()

// Textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightColorTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalColorTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessColorTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessColorTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const eviromentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
     ])



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color.set('#ff00ff')
// material.color = new THREE.Color('#fff')
// material.wireframe = false
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide


// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 2
// material.displacementScale = 0.05
// material.displacementMap = doorHeightColorTexture
// material.metalnessMap = doorMetalnessColorTexture
// material.roughnessMap = doorRoughnessColorTexture
// material.normalMap = doorNormalColorTexture
// material.normalScale.set(0.1, 0.1)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = eviromentMapTexture



gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.001)
gui.add(material.normalScale, 'x').min(0).max(100).step(0.001).name("normal X")
gui.add(material.normalScale, 'y').min(0).max(100).step(0.001).name("normal Y")
gui.add(material, 'wireframe')





const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
)
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,100, 100),
    material
    )
    torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
    sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
    plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))

    sphere.position.x = plane.position.x + 1.5
    torus.position.x = plane.position.x - 1.5

scene.add(sphere, plane, torus)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update object 
    sphere.rotation.y = elapsedTime * 0.1
    plane.rotation.y = elapsedTime * 0.1
    torus.rotation.y = elapsedTime * 0.1

    sphere.rotation.x = elapsedTime * 0.15
    plane.rotation.x = elapsedTime * 0.15
    torus.rotation.x = elapsedTime * 0.15

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()