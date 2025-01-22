let DOC_ID = '';

$(function () {
    DOC_ID = $('#docId').val();

    new Promise(resolve => {
        resolve();
    })
    .then(() => {
        return getApproverList(setApprover);

    })
    .then((result1) => {
        if(result1) {
            getDocDetail();
        }
    });
});

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

                if(checkDocAuth(data.project_id, MENU) === false) return;

                let userImg = data.user_img;
                if(!userImg) {
                    userImg = '/assets/img/mb_noimg.svg';
                }

                /* 작성자 정보 */
                $('#doc_info').html(
                    `
                    <img src="${userImg}" class="mb_img">
                    <div class="txtCon">
                        <p class="h5" id="d_documentName">${data.document_name}</p>
                        <p class="color-gray mt5">작성자 : ${data.user_name} | 등록일: ${data.created_at.substring(0,10)}</p>
                    </div>
                    `
                );

                $('#d_project').val(data.project_name);
                $('#d_place').val(data.work_place?.place);
                $('#d_permissionPeriodStartAt').val(data.permission_period_start_at);
                $('#d_permissionPeriodEndAt').val(data.permission_period_end_at);
                $('#d_approverType01').val(data.approvals[0].approver_type);
                $('#d_approvalId01').val(data.approvals[0].id);
                $('#d_approverType02').val(data.approvals[1].approver_type);
                $('#d_approvalId02').val(data.approvals[1].id);
                $('#d_approverType03').val(data.approvals[2].approver_type);
                $('#d_approvalId03').val(data.approvals[2].id);
                $('#d_approverType04').val(data.approvals[3].approver_type);
                $('#d_approvalId04').val(data.approvals[3].id);

                const details = $('#d_details tr');
                for (let i = 0; i < data.details.length; i++) {
                    const constructionName = $(details[i]).find('textarea[name="constructionName"]');
                    const workDetail = $(details[i]).find('textarea[name="workDetail"]');
                    const worker = $(details[i]).find('textarea[name="worker"]');
                    const equipment = $(details[i]).find('textarea[name="equipment"]');
                    const mechanicalEquipmentStatus = $(details[i]).find('textarea[name="mechanicalEquipmentStatus"]');

                    constructionName.val(data.details[i].construction_name);
                    workDetail.val(data.details[i].work_detail);
                    worker.val(data.details[i].worker);
                    equipment.val(data.details[i].equipment);
                    mechanicalEquipmentStatus.val(data.details[i].mechanical_equipment_status);
                }

                const risks = $('#d_risks tr');
                for (let i = 0; i < data.risks.length; i++) {
                    const workDetail = $(risks[i]).find('textarea[name="workDetail"]');
                    const riskFactor = $(risks[i]).find('textarea[name="riskFactor"]');
                    const occurrenceFrequency = $(risks[i]).find('textarea[name="occurrenceFrequency"]');
                    const riskIntensity = $(risks[i]).find('textarea[name="riskIntensity"]');
                    const evaluationResult = $(risks[i]).find('textarea[name="evaluationResult"]');
                    const riskReductionMeasure = $(risks[i]).find('textarea[name="riskReductionMeasure"]');

                    workDetail.val(data.risks[i].work_detail);
                    riskFactor.val(data.risks[i].risk_factor);
                    occurrenceFrequency.val(data.risks[i].occurrence_frequency);
                    riskIntensity.val(data.risks[i].risk_intensity);
                    evaluationResult.val(data.risks[i].evaluation_result);
                    riskReductionMeasure.val(data.risks[i].risk_reduction_measure);
                }
            }
        }
    );
}

function setApprover(optionEl) {
    $('#d_approverList01').append(optionEl);
    $('#d_approverList02').append(optionEl);
    $('#d_approverList03').append(optionEl);
    $('#d_approverList04').append(optionEl);
}

function approvalRequest() {
    let approval01 = $('#d_approverType01').parent();
    let approval02 = $('#d_approverType02').parent();
    let approval03 = $('#d_approverType03').parent();
    let approval04 = $('#d_approverType04').parent();

    let userId01 = approval01.find('#d_approverList01').val();
    let userId02 = approval02.find('#d_approverList02').val();
    let userId03 = approval03.find('#d_approverList03').val();
    let userId04 = approval04.find('#d_approverList04').val();

    if (userId01 === '0') {
        alert("결재1 담당자를 선택하지 않았습니다.");

    }else if (userId02 === '0') {
        alert("결재2 담당자를 선택하지 않았습니다.");

    }else if (userId03 === '0') {
        alert("결재3 담당자를 선택하지 않았습니다.");

    }else if (userId04 === '0') {
        alert("결재4 담당자를 선택하지 않았습니다.");

    }else {
        let approvalArray = [];

        approvalArray.push({
            'id': approval01.find('#d_approvalId01').val(),
            'userId': userId01,
        });
        approvalArray.push({
            'id': approval02.find('#d_approvalId02').val(),
            'userId': userId02,
        });
        approvalArray.push({
            'id': approval03.find('#d_approvalId03').val(),
            'userId': userId03,
        });
        approvalArray.push({
            'id': approval04.find('#d_approvalId04').val(),
            'userId': userId04,
        });

        let formData = {};
        formData['projectId'] = PROJECT_ID;
        formData['userId'] = USER_ID;
        formData['docId'] = DOC_ID;
        formData['docType'] = 'DOC_WORK_PERMIT';
        formData['documentName'] = $('#d_documentName').text();
        formData['approvals'] = approvalArray;
        formData['permissionPeriodStartAt'] = $('#d_permissionPeriodStartAt').val();
        formData['permissionPeriodEndAt'] = $('#d_permissionPeriodEndAt').val();

        callAPI(
            {
                method: "POST",
                url: SERVER_URL + `/doc/process/approval`,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(formData)
            },
            function (response) {
                if (response.status === 200) {
                    alert("설정하신 담당자에게 결재 요청을 진행합니다.");
                    formSubmit("/doc/approval/list");
                }
            }
        );
    }
}