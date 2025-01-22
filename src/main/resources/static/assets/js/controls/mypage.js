$(function() {
    init();
});

function init() {
    // 최초 실행되는 함수들은 순차(동기)적으로 진행..
    setMyProfile()
    .then(r => {
        if(r) setMyProjectList();
    })
}
// 나의 프로필 셋팅
async function setMyProfile() {
    let flag = false;

    await callAPI(
        {
            method: "GET",
            url: SERVER_URL + '/user/info',
            headers: { Authorization: `Bearer ${TOKEN}` }
        },
        function(response) {
            const resData = response.data?.data;
            $('#my-name').val(resData.name);
            $('#my-email').val(resData.email);
            $('#my-id').val(resData.user_id);
            $('#my-projectName').val(resData.project_name);
            $('#my-phone').val(resData.phone);

            flag = true;
        }
    )
    return flag;
}

// 프로젝트 정보 셋팅
function setMyProjectList() {
    getProjectList().then(projectList => {
        let elem = ``;

        $(projectList).each(function(idx,item) {
            elem += `
                <div class="box">
                    <div class="fxContainer gap10 label100">
                        <div class="fx-list">
                            <div class="fx-label">협력사명</div>
                            <div class="fx-con">
                                <input type="text" name="" value="${item.name}" class="w-full"  placeholder="" disabled>
                            </div>
                        </div>
                        <div class="fx-list flex-top">
                            <div class="fx-label">소개</div>
                            <div class="fx-con">
                                <textarea name="" class="h-100" disabled>${item.contents?.length > 0 ? item.contents : '-'}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        })

        $('#my-project').html(elem);
    });
}

// 비밀번호 변경
function changePw() {
    const $before_password = $('#before_password');
    const $password = $('#password');
    const $confirm_password = $('#confirm_password');

    if(!$before_password.val()) {
        $before_password.focus();
        alert('기존 비밀번호를 입력해주세요.');

    }else if(!isPassword($password.val())) {
        $password.focus();
        alert('비밀번호는 8~16자의 영문자+숫자를 조합하여 입력해주세요.');

    }else if(!isPassword($confirm_password.val())) {
        $confirm_password.focus();
        alert('비밀번호는 8~16자의 영문자+숫자를 조합하여 입력해주세요.');

    }else if($password.val() !== $confirm_password.val()) {
        $confirm_password.focus();
        alert('새 비밀번호가 일치하지 않습니다.');

    } else {
        callAPI(
            {
                method: "patch",
                url: SERVER_URL + '/user/change/login-password',
                headers: { Authorization: `Bearer ${TOKEN}` },
                params : {
                    'newpassword' : $password.val(),
                    'password' : $before_password.val()
                }
            },
            function(response) {
                if(response.status === 200) {
                    alert('비밀번호가 재설정되었습니다.');
                    $('.popClose').click();
                }
            },
            function(error) {
                if(error.response.status === 400 && error.response.data?.msg?.includes('기존')) {
                    // 기존 비밀번호가 일치하지 않는 경우
                    alert(error.response?.data?.msg?.replace('400 ',''));

                }else {
                    alert('오류가 발생하였습니다.');
                }
            }
        );
    }
}