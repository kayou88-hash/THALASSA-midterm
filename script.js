const serviceName = "THALASSA";
let isSubscribed = false;
let submitCount = 0;


function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";  
    }
    
    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeform = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail ==="") {
        subscribeMessage.textContent =
          "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;
    
    subscribeMessage.textContent = 
      makeSubscribeMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeform.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
// const nicknameInput = document.querySelector("#nickname");
// const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "에테르 테마" : "아르카디아 테마";
}

themeButton.addEventListener("click", handleThemeClick);

// function handlenicknameInput(){
//     const maxLength = nicknameInput.maxLength;
//     const currentLength = Math.min(nicknameInput.value.length, maxLength);

//     nicknameCount.textContent = currentLength + " / " + maxLength;
// }

// nicknameInput.addEventListener("input", handlenicknameInput);

function handleAgreeChange() {
   const agreed = agreeCheck.checked;

   startButton.disabled = !agreed;
   agreeMessage.textContent = agreed
    ? "테스트 피드백을 작성할 수 있습니다."
    : "동의 후 게임 테스트 피드백을 작성할 수 있습니다.";

   if(agreed) {
    agreeMessage.classList.add("is-ready");
   } else {
    agreeMessage.classList.remove("is-ready");

   }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");

    });
    panels.forEach(function(panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab){
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector("#" + targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna")
const durationValues = ["3", "5", "10"];

const formData = {
    title:"", duration:"5", qna: false, qnaCount:"2"
};

function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
    agreeCheck.checked=false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    recordingDialog.showModal();
});
recordingCancel.addEventListener("click", () => {
    recordingDialog.close();
    revokeRecordingAgreement();
});
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);
recordingConfirm.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    recordingDialog.close();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({behavior : "smooth"});
    titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();
    if(!value) {
        titleError.textContent = "발표 제목을 입력해 주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if(!validateTitle()) return;
    showStep(1);
});

qnaOption.addEventListener("change", () => {
    qnaOptions.hidden =! qnaOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
    const count = document.querySelector('input[name="qna-count"]:checked');
    formData.qnaCount = count.value;
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "시간";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "회 포함" : "미포함";
    showStep(2);


});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "5";
    formData.qna=false;
    formData.qnaCount = "2";
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValues.value = "1시간";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
    document.querySelector('input[name="qna-count"][value="2"]'). checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";
    showStep(0);
});

// 캐릭터 선점 HTML 요소 연결
const reserveDialog = document.querySelector("#reserveDialog");
const reserveSteps = document.querySelectorAll(".reserve-step");

const openReserve = document.querySelector("#openReserve");
const reserveNext = document.querySelector("#reserveNext");
const reserveBack = document.querySelector("#reserveBack");
const reserveClose = document.querySelector("#reserveClose");
const cancelReserve = document.querySelector("#cancelReserve");

const reserveRegion = document.querySelector("#reserveRegion");
const reserveGuardian = document.querySelector("#reserveGuardian");

const reserveNickname = document.querySelector("#reserveNickname");

const checkNickname = document.querySelector("#checkNickname");
const nicknameMessage = document.querySelector("#nicknameMessage");

const reservedNames = ["관리자", "운영자", "THALASSA"];

let nicknameChecked = false;

// 캐릭터명 중복 확인
checkNickname.addEventListener("click", function() {
    const name = reserveNickname.value.trim();

    if (name === "") {
        nicknameMessage.textContent = "캐릭터명을 먼저 입력해주세요.";
        nicknameChecked = false;
        return;
    }

    if (reservedNames.includes(name)) {
        nicknameMessage.textContent = "이미 사용 중인 캐릭터명입니다.";
        nicknameChecked = false;
        return;
    }

    nicknameMessage.textContent = "사용 가능한 캐릭터명입니다.";
    nicknameChecked = true;
});

reserveNickname.addEventListener("input", function() {
    nicknameChecked = false;
    nicknameMessage.textContent = "중복 확인이 필요합니다.(예:관리자,운영자,THALASSA 제외)";
});


const reserveNicknameCount = document.querySelector("#reserveNicknameCount");
const reserveMessage = document.querySelector("#reserveMessage");

const resultRegion = document.querySelector("#resultRegion");
const resultGuardian = document.querySelector("#resultGuardian");
const resultNickname = document.querySelector("#resultNickname");

let reservePage = 0;
let isReserved = false;

function showReserveStep(index) {
    reserveSteps.forEach(function(step, i) {
        step.hidden = i !== index;
    });

    reservePage = index;
    reserveMessage.textContent = "";

    reserveBack.hidden = index === 0 || index === 4;
    reserveNext.hidden = index === 4;

    if (index === 3) {
        reserveNext.textContent = "선점 완료";
    } else {
        reserveNext.textContent = "다음";
    }
}

reserveNext.addEventListener("click", function() {

if (reservePage === 2 && reserveNickname.value.trim() === "") {
    reserveMessage.textContent = "캐릭터명을 입력해주세요";
    return;
}

if (reservePage === 2 && nicknameChecked === false) {
    reserveMessage.textContent = "캐릭터명 중복 확인을 먼저 해주세요.";
    return;
}

if (reservePage === 2) {
    resultRegion.textContent = reserveRegion.value;
    resultGuardian.textContent = reserveGuardian.value;
    resultNickname.textContent = reserveNickname.value.trim();
}

if (reservePage === 3) {

    document.querySelector("#completeRegion").textContent = reserveRegion.value;
    document.querySelector("#completeGuardian").textContent = reserveGuardian.value;
    document.querySelector("#completeNickname").textContent = reserveNickname.value.trim();

    isReserved = true;
    openReserve.textContent = "선점 내역 확인";
    showReserveStep(4);
    return;
}

showReserveStep(reservePage + 1);

});

//이전 단계
reserveBack.addEventListener("click", function() {
    showReserveStep(reservePage -1);
});

openReserve.addEventListener("click", function() {
    if (isReserved) {
        showReserveStep(4);

    } else {
        showReserveStep(0);
    }
    
    reserveDialog.showModal();
});


//선점 취소
cancelReserve.addEventListener("click", function() {
    isReserved = false;

    reserveRegion.value = "";
    reserveGuardian.value = "";
    reserveNickname.value = "";
    reserveNicknameCount.textContent = "0 / 10";

    openReserve.textContent = "캐릭터 선점하기";

    showReserveStep(0);
    reserveMessage.textContent = "선점이 취소되었습니다.";

});

//팝업닫기

reserveClose.addEventListener("click", function() {
    reserveDialog.close();
});