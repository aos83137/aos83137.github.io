// // Add your javascript here
// // Don't forget to add it into respective layouts where this js file is needed
// $(document).ready(function () {
//     $("#map-image").on("click")
//     {

//     }

//     $('#go-to-top').click(function () {
//         $('html,body').animate({scrollTop: 0}, 400);
//         return false;
//     });

//     $(".gift-send").click(function () {
//         $("#gift-name").text($(this).data("name"));
//     })


//     $("#reserveGiftButton").click(function () {
//         let name = $("#sender-name").val();
//         let message = $("#sender-message").val();
//         $("#reserveGiftButton").text("전송중...");
//         $("#reserveGiftButton").prop("disabled", true);

//         emailjs.init("user_yjLL5xG0A3kkOCH5BGIDh");
//         emailjs.send("wedding-mail", "gift_send", {
//             name: name,
//             gift: $("#gift-name").text(),
//             message: message
//         }).then(function (response) {
//             $('#giftMailModal').modal('hide');
//             alert(name + "님의 메시지가 정상적으로 전송되었습니다.");

//             $("#reserveGiftButton").text("예약하기!");
//             $("#sender-name").val('');
//             $("#sender-message").val('');
//             $("#reserveGiftButton").prop("disabled", false);
//         }, function (err) {
//             alert("메시지 전송이 실패했습니다. 다시 시도해주세요.");
//         });
//     })
// })

// // Smooth scroll for links with hashes
// $("a.smooth-scroll").click(function (event) {
//     // On-page links
//     if (
//         location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") &&
//         location.hostname == this.hostname
//     ) {
//         // Figure out element to scroll to
//         var target = $(this.hash);
//         target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
//         // Does a scroll target exist?
//         if (target.length) {
//             // Only prevent default if animation is actually gonna happen
//             event.preventDefault();
//             $("html, body").animate(
//                 {
//                     scrollTop: target.offset().top
//                 },
//                 1000,
//                 function () {
//                     // Callback after animation
//                     // Must change focus!
//                     var $target = $(target);
//                     $target.focus();
//                     if ($target.is(":focus")) {
//                         // Checking if the target was focused
//                         return false;
//                     } else {
//                         $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
//                         $target.focus(); // Set focus again
//                     }
//                 }
//             );
//         }
//     }
// });

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

// 스크롤 및 터치 이벤트 처리
let touchStartX = 0;
let touchEndX = 0;
window.addEventListener('wheel', (event) => {
  if (isAnimating) return; // 애니메이션 중일 때 스크롤 방지

  if (event.deltaY > 0) {
    changePage(currentPageIndex + 1);
  } else {
    changePage(currentPageIndex - 1);
  }
});

// 터치 이벤트 추가
window.addEventListener('touchmove', (event) => {
  debugtouch = event.changedTouches[0].screenX;
	console.log('Touch is moving', debugtouch);
}, false);

// 터치 이벤트 추가
window.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, false);

window.addEventListener('touchend', (event) => {
  if (isAnimating) return; // 애니메이션 중일 때 스크롤 방지

  touchEndX = event.changedTouches[0].screenX;
  handleGesture();
	touchStartX = 0;
	touchEndX = 0;
}, false);

function handleGesture() {
  if (touchEndX < touchStartX) {
    changePage(currentPageIndex - 1);
  } else if (touchEndX > touchStartX) {
    changePage(currentPageIndex + 1);
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

// 페이지 변경 함수
function changePage(nextIndex) {
  if (nextIndex < 0 || nextIndex >= pages.length) return;

  isAnimating = true;

  pages[currentPageIndex].classList.remove('current-page');
  pages[nextIndex].classList.add('current-page');

  currentPageIndex = nextIndex;

  // 애니메이션이 끝난 후 스크롤 활성화
  setTimeout(() => {
    isAnimating = false;
  }, 800); // 애니메이션 시간보다 조금 빠르게 설정

  // 메뉴 닫기
  menu.classList.remove('active');
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
