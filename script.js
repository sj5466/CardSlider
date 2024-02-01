const wrapper = document.querySelector(".wrapper")
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWith = carousel.querySelector(".card").offsetWidth; // offsetWidth은 엘리먼트의 크기를 측정
const carouselChildrens = [...carousel.children]; // carousel 의 상속받는 자식들을 배열로 복사

let isDragging = false, startX, startScrollLeft, timeoutId;

// 한 번에 carousel에 들어갈 수 있는 카드 수를 가져옴
let cardPerView = Math.round(carousel.offsetWidth / firstCardWith);

// 무한 스크롤을 위해 carousel 끝에 처음 몇 장의 카드 사본을 삽입
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// 무한 스크롤을 위해 캐러셀 끝에 처음 몇 장의 카드 사본을 삽입
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// carousel의 왼쪽 및 오른쪽으로 스크롤하기 위한 화살표 버튼에 대한 이벤트 추가
arrowBtns.forEach(btn => {
    btn.addEventListener("click",()=>{
        carousel.scrollLeft += btn.id === "left" ? -firstCardWith : firstCardWith
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // carousel의 초기 커서 및 스크롤 위치를 기록
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // isDraging이 false인 경우 여기에서 돌아옴
    // 커서 움직임에 따라 carousel의 스크롤 위치를 업데이트
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

// 자동으로 화면이 전환되도록 지정
const autoPlay = ()=>{
    if(window.innerWidth < 800)return;
    timeoutId = setTimeout(()=> carousel.scrollLeft += firstCardWith, 2500)
}
autoPlay()

//방향 버튼을 누를 시 맨 처음 또는 마지막 card 지점이 와도 scroll 되도록 구현
const infiniteScroll = () =>{
    if(carousel.scrollLeft === 0){
        carousel.classList.add("no-transition"); // 클래스명 no-transition은 css로 scroll event 시 버벅이는 현상을 보완함
        carousel.scrollLeft = carousel.scrollWidth - ( 2 * carousel.offsetWidth )
        carousel.classList.remove("no-transition");
    } else if (carousel.scrollLeft === carousel.scrollWidth - carousel.offsetWidth){
        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // setTimeout 을 끔
    clearTimeout(timeoutId);
    // mouse 가 hover 하지 않으면 다시 자동으로 화면 전환되도록 지정
    if(!wrapper.matches(":hover"))autoPlay();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId)); // mouse가 card 위에 올라 오면 멈춤
wrapper.addEventListener("mouseleave", autoPlay); // mouse가 card위에서 떠나면 자동으로 화면전환