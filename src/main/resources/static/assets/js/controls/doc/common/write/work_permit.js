let PROCESS ;
let ID;

$(function () {
    new Promise(resolve => {
        resolve();
    })
    .then(() => {
        return setProjectList();

    })
    .then((result1) => {
        if(result1) return setWorkPlaceList();

    })
    .then((result2) => {
        if(result2) {
            const params = new URLSearchParams(location.search);

            PROCESS = params.get('process');
            PROCESS = PROCESS === 'WRITE' ? 'COPY' : PROCESS;
            ID = params.get('docId') ?? 0;

            if(ID !== 0) {
                getDocDetail(ID);

            }else {
                headSet(userInfo().user_img, '작업허가서', userInfo().user_name, getToday());
            }
        }
    })
});

// 저장
function createDoc(data) {
    callAPI(
        {
            method: "POST",
            url: SERVER_URL + '/doc/create/doc-work-permit',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        },
        function (response) {
            if (response.status === 200) {
                alert(`작업허가서가 저장되었습니다.`);
                formSubmit('/doc/storage/list');
            }
        }
    );
}

// 저장 데이터 셋팅
function save() {
    const documentName = $('#d_documentName');
    const project = $('#d_project');
    const place = $('#d_place');
    const permissionPeriodStartAt = $('#d_permissionPeriodStartAt');
    const permissionPeriodEndAt = $('#d_permissionPeriodEndAt');
    const approverType01 = $('#d_approverType01');
    const approverType02 = $('#d_approverType02');
    const approverType03 = $('#d_approverType03');
    const approverType04 = $('#d_approverType04');

    if (!documentName.val()) {
        documentName.focus();
        alert('제목이 입력되지 않았습니다.');

    } else if (!project.val()) {
        project.focus();
        alert('업체명이 선택되지 않았습니다.');

    } else if (!place.val()) {
        place.focus();
        alert('작업 장소가 선택되지 않았습니다.');

    } else if (!permissionPeriodStartAt.val()) {
        permissionPeriodStartAt.focus();
        alert('허가 기간이 선택되지 않았습니다.');

    } else if (!permissionPeriodEndAt.val()) {
        permissionPeriodEndAt.focus();
        alert('허가 기간이 선택되지 않았습니다.');

    } else if (!approverType01.val()) {
        approverType01.focus();
        alert('결재자 직급이 입력되지 않았습니다.');

    } else if (!approverType02.val()) {
        approverType02.focus();
        alert('결재자 직급이 입력되지 않았습니다.');

    } else if (!approverType03.val()) {
        approverType03.focus();
        alert('결재자 직급이 입력되지 않았습니다.');

    } else if (!approverType04.val()) {
        approverType04.focus();
        alert('결재자 직급이 입력되지 않았습니다.');

    } else {
        const formData = {};

        /* 기본 정보 */
        formData['process'] = PROCESS;
        formData['id'] = ID;
        formData['documentName'] = documentName.val();
        formData['projectId'] = project.val();
        formData['docPlaceId'] = place.val();
        formData['permissionPeriodStartAt'] = permissionPeriodStartAt.val();
        formData['permissionPeriodEndAt'] = permissionPeriodEndAt.val();

        /* 결재 정보들 */
        let approvalArray = [];

        approvalArray.push({
            'approverType': approverType01.val(),
            'signature': '',
            'opinion': ''
        });

        approvalArray.push({
            'approverType': approverType02.val(),
            'signature': '',
            'opinion': ''
        });

        approvalArray.push({
            'approverType': approverType03.val(),
            'signature': '',
            'opinion': ''
        });

        approvalArray.push({
            'approverType': approverType04.val(),
            'signature': '',
            'opinion': ''
        });

        formData['approvals'] = approvalArray;

        /* 상세 정보들 */
        let detailArray = [];

        $('#d_details tr').each(function () {
            const constructionName = $(this).find('textarea[name="constructionName"]');
            const workDetail = $(this).find('textarea[name="workDetail"]');
            const worker = $(this).find('textarea[name="worker"]');
            const equipment = $(this).find('textarea[name="equipment"]');
            const mechanicalEquipmentStatus = $(this).find('textarea[name="mechanicalEquipmentStatus"]');

            detailArray.push({
                'constructionName': constructionName.val(),
                'workDetail': workDetail.val(),
                'worker': worker.val(),
                'equipment': equipment.val(),
                'mechanicalEquipmentStatus': mechanicalEquipmentStatus.val()
            });
        });

        formData['details'] = detailArray;

        /* 위험 내용들 */
        let riskArray = [];

        $('#d_risks tr').each(function () {
            const workDetail = $(this).find('textarea[name="workDetail"]');
            const riskFactor = $(this).find('textarea[name="riskFactor"]');
            const occurrenceFrequency = $(this).find('textarea[name="occurrenceFrequency"]');
            const riskIntensity = $(this).find('textarea[name="riskIntensity"]');
            const evaluationResult = $(this).find('textarea[name="evaluationResult"]');
            const riskReductionMeasure = $(this).find('textarea[name="riskReductionMeasure"]');

            riskArray.push({
                'workDetail': workDetail.val(),
                'riskFactor': riskFactor.val(),
                'occurrenceFrequency': occurrenceFrequency.val(),
                'riskIntensity': riskIntensity.val(),
                'evaluationResult': evaluationResult.val(),
                'riskReductionMeasure': riskReductionMeasure.val()
            });
        });

        formData['risks'] = riskArray;

        createDoc(formData);
    }
}

function getDocDetail(docId) {
    callAPI(
        {
            method: "GET",
            url: SERVER_URL + `/doc/detail/doc-work-permit`,
            params: {
                projectId: PROJECT_ID,
                id: docId
            }
        },
        function (response) {
            if (response.status === 200) {
                const data = response.data.data;

                if(checkDocAuth(data.project_id, MENU) === false) return;

                headSet(data.user_img ?? '/assets/img/mb_noimg.svg', data.document_name, data.user_name, data.created_at.substring(0,10));

                if(USER_AUTH === 'ADMIN') $('#d_project').val(data.project_id);
                $('#d_place').val(data.work_place?.id);
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

                    workDetail.val(data.risks[i].work_detail);
                    riskFactor.val(data.risks[i].risk_factor);
                    occurrenceFrequency.val(data.risks[i].occurrence_frequency);
                    riskIntensity.val(data.risks[i].risk_intensity);
                    evaluationResult.val(data.risks[i].evaluation_result);
                    riskReductionMeasure.val(data.risks[i].risk_reduction_measure);
                }

                refreshSelect();
            }
        },
        function (error) {

        }
    );
}