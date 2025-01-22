// 문서 작성자 프로필 셋팅
function headSet(img, docName, userName, date) {
    $('.form_headSet').html(`
        <img class="mb_img" id="reg_user_img" alt="사용자 대표 이미지" src="${img}"/>
        <div class="txtCon">
            <input id="d_documentName" type="text" value="${docName}" class="inp w-full" placeholder="제목">
            <p class="color-gray mt5" id="doc_info">작성자 : ${userName} | 등록일 : ${date}</p>
        </div>
    `);
}

// 업체명(내가 속해있는 프로젝트 목록) 셋팅
async function setProjectList() {
    let isOk = false;

    await getProjectList().then(projectList => {
        let projectListHtml = ``;

        projectList.forEach(function(item) {
            projectListHtml += `
                <option value="${item.id}">${item.name}</option>
            `;
        });

        const $projectSelectBox = $('.data_form_container #d_project');

        $projectSelectBox.html(projectListHtml);
        $projectSelectBox.val(PROJECT_ID);
        refreshSelect();

        isOk = true;
    });

    return isOk;
}

// 작업 장소 목록 셋팅
async function setWorkPlaceList() {
    let isOk = false;

    await callAPI(
        {
            method: "GET",
            url: SERVER_URL + '/doc/list/place',
            params: {
                'companyId' : COMPANY_ID
            }
        },
        function(response) {
            const placeList = response.data?.data?.placeList;
            const $projectSelectBox = $('.data_form_container #d_place');

            let html = `<option value="">작업 장소 선택</option>`;

            placeList.forEach(function(item) {
                html += `<option value="${item.id}">${item.place}</option>`;
            });

            $projectSelectBox.html(html);
            refreshSelect();

            isOk = true;
        }
    );

    return isOk;
}

// 문서 전용 input text 제어 함수
function docInputTextControl(elem, rowMaxTextLength) {
    let text = $(elem).val();
    const lines = text.split('\n');
    const maxBytesPerLine = rowMaxTextLength * 2; // 한줄당 입력 가능한 byte
    let currentAllByte = 0; // 현재 입력받은 글자의 byte

    // 1. 한 줄당 최대 byte 수 체크
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineBytes = countBytes(line);
        currentAllByte = currentAllByte + lineBytes;

        if (lineBytes > maxBytesPerLine) {
            // 최대 바이트 수를 초과한 경우 경고 메시지를 띄우고 초과한 글자를 삭제
            lines[i] = truncateLine(line, maxBytesPerLine);
        }
    }

    text = lines.join('\n');

    $(elem).val(text);
}

// 문서 전용 textarea 제어 함수
function docTextareaControl(elem, maxRows, rowMaxTextLength) {
    /**
     * maxRows = 최대 줄 수
     * rowMaxTextLength = 한줄당 최대 입력 가능한 문자 수(한글 기준)
     * 아래 로직에서는 한글=2byte, 나머지=1byte로 계산함
     * 예시) rowMaxTextLength === 10 이면 한줄에 한글 최대 10글자, 나머지 최대 20글자가 입력 가능함
     * */

    let text = $(elem).val();
    const lines = text.split('\n');
    const maxLength = Number(maxRows) * Number(rowMaxTextLength);
    const maxBytesPerLine = rowMaxTextLength * 2; // 한줄당 입력 가능한 byte
    const maxBytesAllLine = maxBytesPerLine * maxRows; // 전체 입력 가능한 byte
    let currentAllByte = 0; // 현재 입력받은 글자의 byte

    // 1. 한 줄당 최대 byte 수 체크
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineBytes = countBytes(line);
        currentAllByte = currentAllByte + lineBytes;

        if (lineBytes > maxBytesPerLine) {
            // 최대 바이트 수를 초과한 경우 경고 메시지를 띄우고 초과한 글자를 삭제
            alert('한 줄당 입력 가능한 글자 길이를 초과하였습니다.\n엔터키 입력 후 추가 입력해주시기 바랍니다.');
            lines[i] = truncateLine(line, maxBytesPerLine);
        }
    }

    text = lines.join('\n');

    // 2. 최대 글자 수 제한
    /*const removeEnterText = text.replace(/\n/ig, "");
    if(currentAllByte > maxBytesAllLine)  {
        text = text.substring(0, maxLength + text.length - removeEnterText.length);
    }*/

    // 3. 최대 라인 수 제한
    const rows = text.split('\n').length;
    if( rows > maxRows ){
        const replaceText = text.split("\n").slice(0, maxRows);
        text = replaceText.join("\n");
        alert(`최대 ${maxRows}줄까지 입력 가능합니다.`);
    }

    $(elem).val(text);
}

// 문자열의 바이트 수를 계산하는 함수
function countBytes(str) {
    let bytes = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        bytes += charCode > 255 ? 2 : 1; // 한글은 2바이트, 그 외는 1바이트
    }
    return bytes;
}

// 문자열을 주어진 바이트 수로 잘라내는 함수
function truncateLine(str, maxBytes) {
    let bytes = 0;
    let truncatedStr = '';
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const charBytes = charCode > 255 ? 2 : 1; // 한글은 2바이트, 그 외는 1바이트

        if (bytes + charBytes > maxBytes) {
            break;
        }

        truncatedStr += str.charAt(i);
        bytes += charBytes;
    }
    return truncatedStr;
}

// 결재하기 버튼 클릭(서명 모달 오픈)
function clickApprovalBtn() {
    let target = '#_pop_doc_sign';

    $(target).addClass('open');
    $('body').append('<div class="popCover"></div>');
    $('.popCover').fadeIn(300);
    if($(target).find('.pop-closer, .popClose').length === 0) {
        $(target).prepend('<span class="pop-closer">팝업닫기</span>');
    }
    $('body, html').css('overflow', 'hidden');
    click_popClose();
}

// 서명 모달에서 되돌리기 클릭
function clear() {
    SIGN.clear();
}

// 밀폐공간 작업허가서 - 발생일자(시작일) 변경 이벤트
function changeStartDate(orgElem, changeElem) {
    const value = $(orgElem).val();

    if(value) {
        const date = new Date(value);

        // 발생일자(시작일) ~ +6일 까지 총 7개 엘리먼트 셋팅(mm/dd)
        $(changeElem).each(function(idx,elem) {
            $(elem).text(numberPad(date.getMonth()+1,2) + '/' + numberPad(date.getDate(),2));
            date.setDate(date.getDate() + 1);
        });
    }
}

/*
* 로그인한 유저가 해당 문서를 볼 수 있는지 체크
* 문서 저장소 메뉴만 체크함
* USER 권한 유저만 체크함
* @param {String} docProjectId 문서의 프로젝트 id값
* @param {String} menuType 현재 메뉴 타입
*/
function checkDocAuth(docProjectId, menuType) {
    if( String(USER_AUTH) !== 'ADMIN'
        && menuType === '문서저장소'
        && String(PROJECT_ID) !== String(docProjectId)
    ) {
        alert('페이지에 접근할 수 없습니다.');
        formSubmit('/doc/storage/list');
        return false;
    }
}

/*
* 로그인한 유저가 해당 문서를 볼 수 있는지 체크
* 결재 문서함 메뉴만 체크함
* USER 권한 유저만 체크함
* @param {String} docId 문서의 id값
* @param {String} menuType 현재 메뉴 타입
* @param {String} 문서 타입(4가지중 1)
*/
async function checkApprovalDetailAuth(docId, menuType, docType) {
    let result = false;

    if( String(USER_AUTH) !== 'ADMIN'
        && menuType === '결재문서함'
    ) {
        await callAPI(
            {
                method: "POST",
                url: SERVER_URL + `/doc/approval/checkDetailAuth`,
                data: {
                    'projectId': PROJECT_ID,
                    'docId': docId,
                    'docType' : docType
                }
            },
            function (response) {
                if (response.status === 200 && !response.data.data) {
                    alert('페이지에 접근할 수 없습니다.');
                    formSubmit('/doc/approval/list');
                    result = false;
                }else {
                    result = true;
                }
            },
            function (error) {

            }
        );
    }else {
        result = true;
    }

    return result;
}

// 결재자 목록 셋팅
async function getApproverList(setApproverList) {
    let isOk = false;

    await callAPI(
        {
            async: false
            ,method: "GET"
            ,url: SERVER_URL + `/doc/list/approver`
            ,params: {
                projectId: PROJECT_ID,
                userId: USER_ID
            }
        },
        function (response) {
            if (response.status === 200) {
                const data = response.data.data;

                let optionEl = '';
                for (let i = 0; i < data.length; i++) {
                    optionEl += `<option value="${data[i].id}">${data[i].user_name} | ${data[i].project_name}</option>`;
                }

                setApproverList(optionEl);
                refreshSelect();

                isOk = true;
            }
        }
    );

    return isOk;
}