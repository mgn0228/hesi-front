const SERVER_URL = getServerUrl();

$(function() {
    // 약관 정보 스토리지에 저장
    //setPolicyInfo();
})

// 로그아웃
function logout() {
    if(confirm('로그아웃 하시겠습니까?')) {
        localStorage.clear();
        formSubmit('/logout');
    }
}

// 메일 주소 불러오기
function getMailAddress() {
    return "";
}

// SERVER_URL 셋팅
function getServerUrl() {
    const hostName = location.hostname;
    let url = '';

    switch(true) {
        case hostName.includes('test'):
            url = 'https://abcd.efgtest.com';
            break;
        default:
            url = 'http://localhost:8098';
            break;
    }
    return url;
}

// 공통 axios 통신
function callAPI(option,success,failure) {
    return axios(option)
    .then(function (response) {
        // console.log(option.url, response);

        success(response);

    }).catch(function (error) {
        console.log(option.url, error);

        if(error?.response?.status === 401 && error?.response?.data?.msg?.includes('토큰을')) {
            alert('토큰을 넣어주세요.');

        }else if(failure) {
            failure(error);

        }else {
            alert('오류가 발생하였습니다.');
        }
    })
}

// 엔터키 이벤트 부여
function enterKeyEvent(elem,callback) {
    $(elem).on("keyup",function(key){
        if(key.keyCode === 13) {
            callback();
        }
    });
    // elem : 엔터키 이벤트를 발생시킬 엘리먼트
    // callback : 엔터키를 눌렀을때 발생시킬 함수
}

// 클릭 이벤트 부여
function clickEvent(elem, callback) {
    $(elem).on("click", function(key){
        callback();
    });
    // elem: 클릭 이벤트를 발생시킬 엘리먼트
    // callback: 클릭했을때 발생시킬 함수
}

// 페이징 만들기
function makePaging(pageLength, targetPage, callback) {
    pageLength = Number(pageLength);
    targetPage = Number(targetPage);

    let $pagination = $('.pg_wrap');
    let html = "";
    let active = "";
    let prevPage = 1;
    let nextPage = 1;

    if(targetPage > 1) {
        prevPage = targetPage-1;
    }

    if(targetPage < pageLength) {
        nextPage = targetPage+1;

    }else if(targetPage === pageLength) {
        nextPage = targetPage;
    }

    html += '<a href="#" data-pageNum="1" class="pg_btn first"></a>';
    html += '<a href="#" data-pageNum="'+(prevPage)+'" class="pg_btn prev"></a>';

    let startNo = 0;
    let endNo = 10;

    if(pageLength > 10) {
        if(targetPage-5 > 0) {
            if(targetPage+5 <= pageLength) {
                startNo = targetPage-6;

            }else {
                startNo = pageLength-10;
            }
        }

        if(targetPage > 5) {
            if(targetPage+5 <= pageLength) {
                endNo = targetPage+4;

            }else {
                endNo = pageLength;
            }
        }
    }else {
        endNo = pageLength;
    }

    for(let i = startNo; i < endNo; i++) {
        if((i+1) === targetPage) {
            active = "active";
        } else {
            active = "";
        }

        html += '<a href="#" class=\"pg_btn '+active+'\" data-pageNum="'+(i+1)+'">'+(i+1)+'</li>';
    }

    html += '<a href="#" data-pageNum="'+nextPage+'" class="pg_btn next"></a>';
    html += '<a href="#" data-pageNum="'+pageLength+'" class="pg_btn last"></a>';

    $pagination.html(html);

    $pagination.find('a').click(function() {
        callback(Number($(this).data("pagenum")));
    });
}

// 리스트의 No 구하기
function makeListNo(listCount, idx, pageNo, pageSize) {
    return listCount - idx - (pageSize  * (pageNo - 1));
}

// input에 숫자만 입력받기
function inputOnlyNumber(elem) {
    elem.value = elem.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    // 사용방법 : oninput="inputOnlyNumber(this)"
}

// 세션 스토리지에 있는 유저 정보 JSON으로 반환
function userInfo() {
    return JSON.parse(localStorage.getItem('user'));
}

// 동적 form 생성 및 submit
function formSubmit(action,data) {
    // form 태그 생성 & 속성부여
    const newForm = document.createElement("form");
    newForm.setAttribute("method", "POST");
    newForm.setAttribute("action", action);

    if(data) {
        let newInput = '';
        const keys = Object.keys(data);
        const values = Object.values(data);

        // input 태그 생성 & 속성부여
        keys.forEach(function(item,idx) {
            newInput = document.createElement("input");
            newInput.setAttribute("type", "hidden");
            newInput.setAttribute("name", item);
            newInput.setAttribute("value", values[idx]?.toString());

            // input을 form의 자식태그로 붙이기
            newForm.appendChild(newInput);
        })
    }

    // form을 body태그의 자식태그로 붙이기
    document.body.appendChild(newForm);
    newForm.submit();
}

// 체크박스 이벤트 부여하기
function setCheckboxEvent(allElem, otherElem, topElem) {
    /*
    * allElem : 전체 체크박스
    * otherElem : 나머지 체크박스들
    * topElem : allElem, otherElem를 포함하는 상위 엘리먼트
    * */

    // 전체 체크박스 클릭
    $(allElem).unbind('click').bind('click',function() {
        if($(this).is(':checked')) {
            $(otherElem).prop('checked',true);
        }else {
            $(otherElem).prop('checked',false);
        }
    });

    // 나머지 체크박스 클릭
    $(otherElem).unbind('click').bind('click',function() {
        if($(topElem).find('input[type=checkbox]:checked').not(allElem).length === $(otherElem).length) {
            $(allElem).prop('checked',true);
        }else {
            $(allElem).prop('checked',false);
        }
    });
}

// 자릿수 만큼 앞에 0 채우기
function numberPad(value, fullLength) {
    value = value + '';
    return value.length >= fullLength ? value : new Array(fullLength - value.length + 1).join('0') + value;
}

// 오늘 날짜 구하기(yyyy-mm-dd)
function getToday(){
    return changeDateFormat(new Date());
}

// yyyy-mm-dd로 변환 후 리턴
function changeDateFormat(date) {
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
}

// maxlength 만큼 글자 수 제한시키기
function handleOnInput(el, maxlength) {
    if(el.value.length > maxlength)  {
        el.value = el.value.substring(0, maxlength);
    }
}

function fileSizeToMB(size) {
    return ((size / 1024 / 1024 * 10) / 10).toFixed(2);
}

// select box 값 동적 부여 후 재설정
function refreshSelect() {
    setTimeout(function() {
        $('select').selectpicker('refresh');
    },200);
}

// 사인 패드 js 이벤트 부여
function setSignPad(canvas) {
    return new SignaturePad(canvas, {
        minWidth: 1,
        maxWidth: 1,
        penColor: "black"
    })
}

// 세션 스토리지에 저장된 검색 데이터 정리
function checkSessionSearchData() {
    const url = window.location.href;

    if(url.includes('/doc/approval/')) {
        sessionStorage.removeItem('member');
        sessionStorage.removeItem('created');
        sessionStorage.removeItem('storage');

    }else if(url.includes('/member')) {
        sessionStorage.removeItem('approval');
        sessionStorage.removeItem('created');
        sessionStorage.removeItem('storage');

    }else if(url.includes('/doc/created/')) {
        sessionStorage.removeItem('approval');
        sessionStorage.removeItem('member');
        sessionStorage.removeItem('storage');

    }else if(url.includes('/doc/storage/')) {
        sessionStorage.removeItem('approval');
        sessionStorage.removeItem('member');
        sessionStorage.removeItem('created');

    }else {
        sessionStorage.clear();
    }
}

function setSessionSearchData(key,data) {
    sessionStorage.setItem(
        key,
        JSON.stringify(data)
    );
}