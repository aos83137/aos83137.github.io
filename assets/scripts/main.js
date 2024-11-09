let currentPageIndex = 0;
let isAnimating = false;
const pages = document.querySelectorAll('.page');
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');
const menuList = document.getElementById('menuList');

// 목차 동적 생성
pages.forEach((page, index) => {
  const li = document.createElement('li');
  li.textContent = page.getAttribute('data-title');
  li.addEventListener('click', () => changePage(index));
  menuList.appendChild(li);
});

window.addEventListener('wheel', (event) => {
  if (isAnimating) return; // 애니메이션 중일 때 스크롤 방지

  if (event.deltaY > 0) {
    changePage(currentPageIndex + 1);
  } else {
    changePage(currentPageIndex - 1);
  }
});

// 스크롤 및 터치 이벤트 처리
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let touchCount = 0; // 터치 손가락 수 체크
let initialDistance = 0; // 초기 두 손가락 간 거리
let isPinching = false; // 확대/축소 여부
const SWIPE_THRESHOLD = 30;

// 터치 시작 이벤트
window.addEventListener('touchstart', (event) => {
  touchCount = event.touches.length; // 현재 터치 수 저장
  if (touchCount >= 2) {
    // 두 손가락으로 터치 시작
    initialDistance = calculateDistance(event.touches); // 초기 거리 계산
    isPinching = true; // 확대/축소 제스처 감지 시작
    console.log('Two-finger gesture detected.');
    return; // 두 손가락으로 터치하는 경우 계속 진행
  }

  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, false);

// 터치 종료 이벤트
window.addEventListener('touchend', (event) => {
  if (isAnimating) return; // 애니메이션 중일 때 스크롤 방지

  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;

  if (isPinching) {
    // 두 손가락으로 터치한 경우 확대/축소 제스처 처리
    isPinching = false; // 초기화
    touchCount = 0; // 초기화
    initialDistance = 0; // 초기화
    return; // 페이지 변경 방지
  }

  handleGesture();
  
  // 초기화
  touchStartX = 0;
  touchEndX = 0;
  touchStartY = 0;
  touchEndY = 0;
  touchCount = 0; // 초기화
}, false);

// 두 손가락 간 거리 계산
function calculateDistance(touches) {
  const dx = touches[0].screenX - touches[1].screenX;
  const dy = touches[0].screenY - touches[1].screenY;
  return Math.sqrt(dx * dx + dy * dy); // 피타고라스 정리를 이용해 거리 계산
}

// 확대/축소 제스처 처리
window.addEventListener('touchmove', (event) => {
  if (isPinching) {
    const currentDistance = calculateDistance(event.touches);
    if (currentDistance > initialDistance) {
      // 확대 제스처
      console.log('Zoom in');
      // 확대 관련 작업 수행
    } else {
      // 축소 제스처
      console.log('Zoom out');
      // 축소 관련 작업 수행
    }
  }
}, false);

function handleGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // 가로보다 세로의 변화가 클 경우에만 상하 스와이프 처리
  if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > SWIPE_THRESHOLD) {
    event.preventDefault();
    if (deltaY > 0) {
      // 아래로 스와이프
      console.log('Swipe down');
      changePage(currentPageIndex - 1);
    } else {
      // 위로 스와이프
      console.log('Swipe up');
      changePage(currentPageIndex + 1);
    }
  } else {
    // const scrollInstruction = document.querySelector('.scroll-instruction');
    // scrollInstruction.style.display = 'block'; // 요소를 비표시로 설정
  }
}


// 키보드 이벤트 처리
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'PageDown' || event.key === 'PageUp') {
    event.preventDefault();
  }
});

// 메뉴 버튼 클릭 이벤트 처리
menuButton.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// 전체 문서에 클릭 이벤트 리스너 추가
document.addEventListener('click', (event) => {
  // 메뉴 버튼을 클릭했을 때 메뉴가 열리고 닫히지 않도록 예외 처리
  if (menu.contains(event.target) || menuButton.contains(event.target)) {
    return;
  }

  // 메뉴가 열려 있을 때만 닫기
  if (menu.classList.contains('active')) {
    menu.classList.remove('active');
  }
});

// 페이지 로드할때 첫페이지에  current-page달기
// window.onload = function() {
//   setTimeout(()=>{
//     pages[0].classList.add('current-page');
//   }, 5000)
  
// };

const video = document.getElementById('introVideo');
// 재생 시간 확인 변수
let isOneSecondLeftEventTriggered = false;
video.addEventListener('timeupdate', () => {
  if (video.duration - video.currentTime <= 2 && !isOneSecondLeftEventTriggered) {
     // 이벤트 실행
     document.getElementById("loader").classList.add("fade-out");
     pages[0].classList.add('current-page');
     isAnimating = false;
     isOneSecondLeftEventTriggered = true;
  }
  

  // 만약 동영상이 끝났다면 플래그 초기화
  if (video.currentTime === 0) {
     isOneSecondLeftEventTriggered = false;
  }
});

video.addEventListener('ended', () => {
  document.getElementById("loader").style.display = "none";

  // 스크롤 활성화
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  // 스크롤 안내 표시 보이기
  const scrollInstruction = document.querySelector('.scroll-instruction');
  scrollInstruction.style.opacity = '0.7';
});

// 페이지 변경 함수
function changePage(nextIndex) {

  if (nextIndex < 0 || nextIndex >= pages.length) return;

  isAnimating = true;

  // pages[currentPageIndex].querySelector('.base-wrapper').style.opacity = '0';
  pages[currentPageIndex].classList.remove('current-page');
  pages[nextIndex].classList.add('current-page');

  currentPageIndex = nextIndex;

  const scrollInstruction = document.querySelector('.scroll-instruction');
  if (scrollInstruction) {
      scrollInstruction.style.display = 'none'; // 요소를 비표시로 설정
  }
  
  // 애니메이션이 끝난 후 스크롤 활성화
  setTimeout(() => {
    isAnimating = false;
  }, 1000); // 애니메이션 시간보다 조금 빠르게 설정

  // 메뉴 닫기
  menu.classList.remove('active');
  // 갤러리 닫기
  lightbox.style.display = 'none';
}

function calculateCountdown() {
  const eventDate = new Date('2025-02-08T15:00:00').getTime(); // 2025년 2월 8일 오후 3시
  const now = new Date().getTime();
  const distance = eventDate - now;

  // 계산
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // DOM 업데이트
  document.getElementById('days').innerText = String(days).padStart(2, '0');
  document.getElementById('hours').innerText = String(hours).padStart(2, '0');
  document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
  document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  document.getElementById('total-days-left').innerText = days;

  // 결혼식이 지나면 카운트다운 멈추기
  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById('days').innerText = "00";
    document.getElementById('hours').innerText = "00";
    document.getElementById('minutes').innerText = "00";
    document.getElementById('seconds').innerText = "00";
    document.getElementById('total-days-left').innerText = "0";
  }
}

// 1초마다 카운트다운 업데이트
const countdownInterval = setInterval(calculateCountdown, 1000);

// 페이지 로드 시 즉시 실행
calculateCountdown();

// page4
// 갤러리 이미지 클릭 시 라이트박스 열기
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImage.src = item.src; // 클릭한 이미지의 src를 가져옴
    });
});

// 라이트박스 닫기
lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

// 라이트박스 배경 클릭 시 닫기
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});

// page4


// page7 참석유무

// AUDIO
const audio = document.getElementById('audio');
const audioIcon = document.getElementById('audio-icon');

audioIcon.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        audioIcon.src = '../assets/images2/on.png'; // 재생 중일 때 아이콘 변경
    } else {
        audio.pause();
        audioIcon.src = '../assets/images2/off.png'; // 일시 정지 중일 때 아이콘 변경
    }
});

