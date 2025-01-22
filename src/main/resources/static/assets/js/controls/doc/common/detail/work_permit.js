const DOC_ID = $('#docId').val();
const MENU_TYPE = $('#menuType').val();
let SIGN = '';
let APPROVAL_ID = '';
let SEQ = 0;
const COMMENT_ON_SEQ_ARR = [20, 30, 40];

$(function () {
    new Promise(resolve => {
        resolve();
    })
    .then(() => {
        return checkApprovalDetailAuth(DOC_ID, MENU, 'doc-work-permit');
    })
    .then((result1) => {
        if(result1) {
            setBase();
            getDocDetail();
        }
    });
});

function setBase() {
    if(MENU_TYPE === 'approval') {
        SIGN = setSignPad($(".signform canvas")[0]);

        $('.form_btnSet').html(`
            <a href="javascript:clickApprovalBtn();" class="_btn/md/line icon_check pop-inline" id="approval_btn" style="display: none;">결재하기</a>
            <a href="javascript:clickPrintBtn('DOC_WORK_PERMIT');" class="_btn/md/line icon_print">문서 인쇄</a>
        `);
    }else {
        const process = MENU_TYPE === 'created' ? 'WRITE' : 'UPDATE';

        $('.form_btnSet').html(`
            <a href="/doc/${MENU_TYPE}/write/work-permit?process=${process}&docId=${DOC_ID}" class="_btn/md/line icon_save" id="btn_doc_edit">문서 편집</a>
            <a href="/doc/${MENU_TYPE}/approval/work-permit/${DOC_ID}" class="_btn/md/line icon_check">결재자 지정</a>
            <a href="javascript:clickPrintBtn('DOC_WORK_PERMIT');" class="_btn/md/line icon_print">문서 인쇄</a>
        `);
    }
}

function getDocDetail() {
    callAPI(
        {
            method: "GET",
            url: SERVER_URL + `/doc/detail/doc-work-permit`,
            params: {
                projectId: PROJECT_ID,
                id: DOC_ID
            }
        },
        function (response) {
            if (response.status === 200) {
                const data = response.data.data;

                if(MENU_TYPE === 'storage' && Number(data.user_id) !== Number(USER_ID)) $('#btn_doc_edit').remove();

                let userImg = data.user_img;

                if(!userImg) {
                    userImg = '/assets/img/mb_noimg.svg';
                }

                $('#doc_info').html(
                    `
                    <img src="${userImg}" class="mb_img">
                    <div class="txtCon">
                        <p class="h5" id="d_documentName">${data.document_name}</p>
                        <p class="color-gray mt5">작성자 : ${data.user_name} | 등록일: ${data.created_at.substring(0,10)}</p>
                    </div>
                    `
                );

                if(MENU_TYPE === 'approval') {
                    $('.temp_approval_select').remove();

                    let flag = true;

                    /* 결재 정보 */
                    for (let i = 0; i < data.approvals.length; i++) {
                        $('#d_approver0' + (i + 1)).text(data.approvals[i].approver_name);

                        if (data.approvals[i].approval_date) {
                            // 결재 완료 상태
                            if(data.approvals[i].signature) {
                                let imgEl = `<img src="${SERVER_URL + data.approvals[i].signature}">`;
                                $('#d_approver0' + (i + 1)).html(imgEl);
                            }

                        } else {
                            // 결재 미완료 상태
                            if(flag) {
                                if (Number(USER_ID) === Number(data.approvals[i].approver_id)) {
                                    // 내 차례면 결재 버튼 보여줌
                                    $('#approval_btn').css('display', 'flex');
                                    APPROVAL_ID = data.approvals[i].id;
                                    SEQ = data.approvals[i].seq;
                                    if(COMMENT_ON_SEQ_ARR.includes(Number(SEQ))) {
                                        $('#signature-comment-box').css('display', 'block');
                                    }
                                }
                                flag = false;
                            }
                        }
                    }
                }else {
                    $('.temp_approval').remove();
                }

                // 본문
                $('#d_project').val(data.project_name);
                $('#d_place').val(data.work_place?.place);
                $('#d_permissionPeriodStartAt').val(data.permission_period_start_at);
                $('#d_permissionPeriodEndAt').val(data.permission_period_end_at);
                $('#d_approverType01').val(data.approvals[0].approver_type);
                $('#d_approverType02').val(data.approvals[1].approver_type);
                $('#d_approverType03').val(data.approvals[2].approver_type);
                $('#d_approverType04').val(data.approvals[3].approver_type);

                const details = $('#d_details tr');

                for(let i = 0; i < data.details.length; i++) {
                    const constructionName = $(details[i]).find('textarea[name="constructionName"]');
                    const workDetail = $(details[i]).find('textarea[name="workDetail"]');
                    const worker = $(details[i]).find('textarea[name="worker"]');
                    const equipment = $(details[i]).find('textarea[name="equipment"]');
                    const mechanicalEquipmentStatus = $(details[i]).find('textarea[name="mechanicalEquipmentStatus"]');

                    // 본문
                    constructionName.val(data.details[i].construction_name);
                    workDetail.val(data.details[i].work_detail);
                    worker.val(data.details[i].worker);
                    equipment.val(data.details[i].equipment);
                    mechanicalEquipmentStatus.val(data.details[i].mechanical_equipment_status);
                }

                const risks = $('#d_risks tr');

                for(let i = 0; i < data.risks.length; i++) {
                    const workDetail = $(risks[i]).find('textarea[name="workDetail"]');
                    const riskFactor = $(risks[i]).find('textarea[name="riskFactor"]');
                    const occurrenceFrequency = $(risks[i]).find('textarea[name="occurrenceFrequency"]');
                    const riskIntensity = $(risks[i]).find('textarea[name="riskIntensity"]');
                    const evaluationResult = $(risks[i]).find('textarea[name="evaluationResult"]');
                    const riskReductionMeasure = $(risks[i]).find('textarea[name="riskReductionMeasure"]');

                    // 본문
                    workDetail.val(data.risks[i].work_detail);
                    riskFactor.val(data.risks[i].risk_factor);
                    occurrenceFrequency.val(data.risks[i].occurrence_frequency);
                    riskIntensity.val(data.risks[i].risk_intensity);
                    evaluationResult.val(data.risks[i].evaluation_result);
                    riskReductionMeasure.val(data.risks[i].risk_reduction_measure);
                }

                setPrintContents('DOC_WORK_PERMIT', data);
            }
        },
        function (error) {

        }
    );
}

function save() {
    /*if(SIGN.isEmpty()) {
        alert('서명이 입력되지 않았습니다.');
        return;
    }*/
    if(SEQ === 0 || APPROVAL_ID === '') {
        return;
    }
    let formData = {};
    formData['docId'] = DOC_ID;
    formData['docType'] = 'DOC_WORK_PERMIT';
    formData['approvalId'] = APPROVAL_ID;
    formData['sign'] = SIGN.toDataURL().split(',')[1];
    formData['opinion'] = $('#opinion').val();
    formData['seq'] = SEQ

    callAPI(
        {
            method: "POST",
            url: SERVER_URL + '/doc/process/approval/signature',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(formData)
        },
        function (response) {
            if (response.status === 200) {
                alert("서명을 완료했습니다.")
                formSubmit(`/doc/approval/detail/work-permit/${DOC_ID}`)
            }
        }
    );
}