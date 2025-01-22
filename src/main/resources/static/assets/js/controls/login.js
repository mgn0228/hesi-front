$(function() {
    const idElem = $('#form_id');
    const pwElem = $('#form_pw');

    if(String(STATUS_CODE) === '401') alert('로그인 유효 시간이 만료되었습니다.\n다시 로그인 해주세요.');
    enterKeyEvent(idElem, login);
    enterKeyEvent(pwElem, login);
    setSavedId();

    // testsaffy.com(개발서버)인 경우 placeholder에 ID, PW 고정
    if(location.hostname?.includes('testsaffy')) {
        idElem.attr('placeholder','ID : saffy');
        pwElem.attr('placeholder','PW : test123!');
    }
});

// 저장된 아이디 셋팅
function setSavedId() {
    const savedId = getCookie('savedId');
    if(savedId) {
        // 저장된 아이디가 있으면
        $('#form_id').val(savedId);
        $('#form_id_save').attr('checked', true);
        $('#form_pw').focus();

    }else {
        $('#form_id').focus();
    }
}

// 로그인
function login() {
    const id = $('#form_id');
    const pw = $('#form_pw');

    if(!id.val()) {
        id.focus();
        alert('아이디를 입력하세요.');

    }else if(!pw.val()) {
        pw.focus();
        alert('비밀번호를 입력하세요');

    }else {
        // 1. 로그인 확인
        callAPI(
            {
                method: "post",
                url: `${SERVER_URL}/user/login`,
                data: {
                    'user_id' : id.val(),
                    'password' : pw.val()
                }
            },
            function(response) {
                if (response.status === 200) {
                    const result = response.data.data;

                    // 2. 자신의 프로젝트 리스트 조회
                    callAPI(
                        {
                            method: "GET",
                            url: SERVER_URL + '/project/list/' + result.company.id,
                            headers: { Authorization: `Bearer ${result.access_token}` }
                        },
                        function(projectResponse) {
                            const firstProject = projectResponse.data.data[0];

                            // 3. 프론트쪽 세션에 정보 저장
                            callAPI(
                                {
                                    method: "post",
                                    url: '/login/save',
                                    data: {
                                        'access_token' : result.access_token,
                                        'user_id' : result.id,
                                        'company_id' : result.company.id,
                                        'project_id' : firstProject.id,
                                        'user_name' : result.user_name,
                                        'user_auth' : result.auth,
                                        'user_img' : '/assets/img/mb_noimg.svg',
                                        'project_name' : firstProject.name
                                    }
                                },
                                function(response2) {

                                    // 4. 로컬 스토리지에 정보 저장
                                    localStorage.setItem(
                                        'user',
                                        JSON.stringify({
                                            'user_name' : result.user_name,
                                            // 'user_auth' : result.auth,
                                            'user_img' : '/assets/img/mb_noimg.svg',
                                            'project_name' : firstProject.name
                                        })
                                    );

                                    if($('#form_id_save').is(":checked")){
                                        // 아이디 저장 체크했을 때 7일 동안 쿠키 보관
                                        setCookie('savedId', $('#form_id').val(), 7);

                                    }else{
                                        // 아이디 저장 체크 해제시 쿠키 삭제
                                        deleteCookie('savedId');
                                    }

                                    // 5. 로그인 페이지로 넘어오기 이전에 요청받은 값이 있으면 이동시고 아니면 인덱스 페이지로
                                    if(response2) location.href = (REQ_URL ?? '/');
                                }
                            );
                        }
                    )
                }
            },
            function (error) {
                const result = error?.response?.data;

                if(result?.code === 'BAD_REQUEST') {
                    $('#error_msg').html('입력하신 아이디 또는 비밀번호가 일치하지 않습니다.');
                }else {
                    $('#error_msg').html('오류가 발생하였습니다.');
                }

                $('#error_msg_parent').show();
            }
        );
    }
}

// 쿠키 저장하기
function setCookie(cookieName, value, exdays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    const cookieValue = value + ((exdays == null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

// 쿠키 삭제
function deleteCookie(cookieName) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

// 쿠키 가져오기
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    const cookieData = document.cookie;
    let start = cookieData.indexOf(cookieName);
    let cookieValue = '';

    if (start !== -1) { // 쿠키가 존재하면
        start += cookieName.length;
        let end = cookieData.indexOf(';', start);
        if (end === -1) // 쿠키 값의 마지막 위치 인덱스 번호 설정
            end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return cookieValue;
}