import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 상태 관리
let state = {
  initialScene: null,
  leftScene: null,
  rightScene: null,
  showTwoScenes: false
};

// HTML 구조 생성
function createHTML() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <h1>정삼각형 8개로 만들 수 있는 다면체는?</h1>
    
    <div id="initial-scene-container"></div>
    
    <button class="check-button" id="check-button">몇 개의 다면체를 만들 수 있는지 확인하기</button>
    
    <button class="reset-button hidden" id="reset-button">처음으로 되돌아가기</button>
    
    <div class="scenes-container" id="scenes-container">
      <div class="scene-wrapper">
        <div class="scene-title">정팔면체 Octahedron </div>
        <div class="scene-container" id="left-scene-container"></div>
        <button class="fold-button" id="left-fold-button">전개도 접어보기</button>
        <div class="slider-container" id="left-slider-container">
          <label class="slider-label hidden" id="left-slider-label">직접 움직여보세요!</label>
          <input type="range" class="slider" id="left-slider" min="0.02" max="1" step="0.01" value="0.02">
        </div>
      </div>
      
      <div class="scene-wrapper">
        <div class="scene-title">보트형 다면체 Boat Polyhedron / Tritetrahedron</div>
        <div class="scene-container" id="right-scene-container"></div>
        <button class="fold-button" id="right-fold-button">전개도 접어보기</button>
        <div class="slider-container" id="right-slider-container">
          <label class="slider-label hidden" id="right-slider-label">직접 움직여보세요!</label>
          <input type="range" class="slider" id="right-slider" min="0.02" max="1" step="0.01" value="0.02">
        </div>
      </div>
    </div>
  `;
}

// 초기 Scene 초기화
function initInitialScene() {
  const container = document.getElementById('initial-scene-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 5, 0);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.update();

  // 조명
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // 모델 로드
  const loader = new GLTFLoader();
  loader.load(
    '/3dModels/8-faced-hedrons-boat.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 리사이즈 핸들러
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  state.initialScene = { scene, camera, renderer, controls, container };
}

// Scene 초기화 (좌우)
function initScene(containerId, modelPath, sliderId, foldButtonId, sliderContainerId) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 5, 0);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.update();

  // 조명
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  // 위에서 내려다보는 각도이므로 위에서 조명 추가
  const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
  topLight.position.set(0, 10, 0);
  topLight.castShadow = true;
  scene.add(topLight);

  // 여러 방향에서 조명 추가하여 색상이 잘 보이도록
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight2.position.set(-5, 5, -5);
  scene.add(directionalLight2);

  const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight3.position.set(5, 5, -5);
  scene.add(directionalLight3);

  const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight4.position.set(-5, 5, 5);
  scene.add(directionalLight4);

  let mixer = null;
  let action = null;
  let animationDuration = 1;
  let isAutoPlaying = false;
  let animationClock = new THREE.Clock();

  // 모델 로드
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      scene.add(model);

      // 애니메이션 설정
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        action = mixer.clipAction(gltf.animations[0]);
        animationDuration = gltf.animations[0].duration;

        const slider = document.getElementById(sliderId);
        slider.max = animationDuration * 0.99;
        slider.min = 0.02;

        // 슬라이더 이벤트
        slider.addEventListener('input', () => {
          const sliderValue = parseFloat(slider.value);
          if (mixer) {
            isAutoPlaying = false; // 자동 재생 중지
            mixer.setTime(sliderValue);
            mixer.update(0);
          }
          if (action) {
            action.paused = false;
            action.play();
          }
        });
      }
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    
    // 애니메이션 업데이트 (자동 재생 중일 때만)
    if (mixer && isAutoPlaying) {
      if (action && action.isRunning() && !action.paused) {
        const delta = animationClock.getDelta();
        mixer.update(delta);
        const slider = document.getElementById(sliderId);
        if (slider) {
          slider.value = mixer.time;
        }
        
        // 애니메이션 완료 체크
        if (mixer.time >= animationDuration * 0.99) {
          isAutoPlaying = false;
          if (action) {
            action.paused = true;
          }
          // 애니메이션이 끝나면 라벨 표시
          const sliderLabel = document.getElementById(sliderId.replace('-slider', '-slider-label'));
          if (sliderLabel) {
            sliderLabel.classList.remove('hidden');
          }
        }
      }
    }
    
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 리사이즈 핸들러
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  // 전개도 접어보기 버튼 이벤트
  const foldButton = document.getElementById(foldButtonId);
  const sliderContainer = document.getElementById(sliderContainerId);
  const slider = document.getElementById(sliderId);

  foldButton.addEventListener('click', () => {
    // 라벨 숨기기 (애니메이션이 끝나면 다시 표시됨)
    const sliderLabel = document.getElementById(sliderId.replace('-slider', '-slider-label'));
    if (sliderLabel) {
      sliderLabel.classList.add('hidden');
    }
    
    if (action && mixer) {
      // 애니메이션 재생
      action.reset();
      action.play();
      action.timeScale = 1;
      action.paused = false;
      
      // 버튼 숨기고 슬라이더 표시
      foldButton.classList.add('hidden');
      sliderContainer.classList.add('active');
      
      // 자동 재생 시작
      isAutoPlaying = true;
      animationClock = new THREE.Clock();
      mixer.setTime(0);
    } else if (mixer) {
      // 애니메이션이 없어도 슬라이더는 표시
      foldButton.classList.add('hidden');
      sliderContainer.classList.add('active');
    }
    
    // 양쪽 슬라이더가 모두 표시되면 "처음으로 되돌아가기" 버튼 표시
    checkAndShowResetButton();
  });

  return { scene, camera, renderer, controls, container, mixer, action };
}

// 양쪽 슬라이더가 모두 표시되었는지 확인
function checkAndShowResetButton() {
  const leftSlider = document.getElementById('left-slider-container');
  const rightSlider = document.getElementById('right-slider-container');
  const resetButton = document.getElementById('reset-button');
  
  if (leftSlider && rightSlider && resetButton) {
    const leftVisible = leftSlider.classList.contains('active');
    const rightVisible = rightSlider.classList.contains('active');
    
    if (leftVisible && rightVisible) {
      resetButton.classList.remove('hidden');
    }
  }
}

// 버튼 클릭 이벤트
function setupEventListeners() {
  const checkButton = document.getElementById('check-button');
  const initialSceneContainer = document.getElementById('initial-scene-container');
  const scenesContainer = document.getElementById('scenes-container');
  const resetButton = document.getElementById('reset-button');

  checkButton.addEventListener('click', () => {
    // 초기 Scene 숨기기
    initialSceneContainer.style.display = 'none';
    checkButton.classList.add('hidden');
    
    // 두 개의 Scene 표시
    scenesContainer.classList.add('active');
    
    // Scene 초기화
    if (!state.leftScene) {
      state.leftScene = initScene(
        'left-scene-container',
        '/3dModels/8-faced-hedrons-octa.glb',
        'left-slider',
        'left-fold-button',
        'left-slider-container'
      );
    }
    
    if (!state.rightScene) {
      state.rightScene = initScene(
        'right-scene-container',
        '/3dModels/8-faced-hedrons-boat.glb',
        'right-slider',
        'right-fold-button',
        'right-slider-container'
      );
    }
  });

  // 처음으로 되돌아가기 버튼
  resetButton.addEventListener('click', () => {
    // 초기 Scene 표시
    initialSceneContainer.style.display = 'block';
    checkButton.classList.remove('hidden');
    
    // 두 개의 Scene 숨기기
    scenesContainer.classList.remove('active');
    resetButton.classList.add('hidden');
    
    // 슬라이더와 버튼 초기화
    const leftSliderContainer = document.getElementById('left-slider-container');
    const rightSliderContainer = document.getElementById('right-slider-container');
    const leftFoldButton = document.getElementById('left-fold-button');
    const rightFoldButton = document.getElementById('right-fold-button');
    
    if (leftSliderContainer) leftSliderContainer.classList.remove('active');
    if (rightSliderContainer) rightSliderContainer.classList.remove('active');
    if (leftFoldButton) leftFoldButton.classList.remove('hidden');
    if (rightFoldButton) rightFoldButton.classList.remove('hidden');
    
    // 슬라이더 값 초기화
    const leftSlider = document.getElementById('left-slider');
    const rightSlider = document.getElementById('right-slider');
    if (leftSlider) leftSlider.value = 0;
    if (rightSlider) rightSlider.value = 0;
  });
}

// 초기화
createHTML();
initInitialScene();
setupEventListeners();
