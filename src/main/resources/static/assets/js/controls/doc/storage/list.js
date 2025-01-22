const PAGE_SIZE = 10;
let PAGE_NO = 1;
let IS_ASC = false;
let DOC_SORT_TYPE = 'CREATE_AT'
let DOC_TYPE = 'ALL'

$(function () {
    setDocList();
    enterKeyEvent($('#s_searchValue'), search);
});

function setDocList(pageNo) {
    if (pageNo) PAGE_NO = pageNo;

    callAPI(
        {
            method: "GET",
            url: SERVER_URL + '/doc/list/storage',
            params: {
                'page': PAGE_NO,
                'size': PAGE_SIZE,
                'projectId': PROJECT_ID,
                'isAsc': IS_ASC,
                'docSortType': DOC_SORT_TYPE,
                'docType': DOC_TYPE,
                'keyword': $('#s_searchValue').val()
            }
        },
        function (response) {
            if (response.status === 200) {
                const docList = response.data.data;
                let nodes = Number(docList?.total_elements) === 0 ? `<li class="tr"><div class="empty_list">등록된 템플릿이 없습니다.</div></li>` : ``;

                docList?.content?.forEach(function (item) {
                    let docTypeEl = ``;
                    let docType = '';

                    switch (item.doc_type) {
                        case 'DOC_WORK_PERMIT' :
                            docTypeEl = `<span class="_tag/color1/small w-8.5em">작업허가서</span>`;
                            docType = 'work-permit';
                            break;
                        case 'DOC_TIME_WORK_PERMIT' :
                            docTypeEl = `<span class="_tag/color2/small">작업허가서(야간/조출/주말)</span>`;
                            docType = 'time-work-permit';
                            break;
                        case 'DOC_OBJECT_HANDLING_PLAN' :
                            docTypeEl = `<span class="_tag/color4/small">중량물 취급 계획서</span>`;
                            docType = 'object-handling-plan';
                            break;
                        case 'DOC_SPACE_WORK_PERMIT' :
                            docTypeEl = `<span class="_tag/color3/small">밀폐공간 작업허가서</span>`;
                            docType = 'space-work-permit';
                            break;
                        case 'DOC_RISK_ASSESSMENT_TABLE' :
                            docTypeEl = `<span class="_tag/color5/small">위험성 평가표</span>`;
                            docType = 'risk-assessment-table';
                            break;
                    }

                    nodes += `
                        <li class="tr">
                            <div class="cell_date">${item.created_at}</div>
                            <div class="cell_subject bold"><span class="cursor-pointer" onclick="goDetail('${item.doc_type}', ${item.id})">${item.document_name}</span></div>
                            <div class="cell_name">${item.user_name}</div>
                            <div class="cell_15">${docTypeEl}</div>
                            <div class="cell_btnSet">
                                <ul>
                                    <li><a href="/doc/storage/write/${docType}?process=COPY&docId=${item.id}" class="li_copy">복사</a></li>
                    `;

                    // 내가 작성한 게시물만 수정, 삭제가 가능함
                    let isMine = false;
                    if (Number(USER_ID) === Number(item.user_id)) isMine = true;
                    if (isMine) {
                        nodes += `
                            <li><a href="/doc/storage/write/${docType}?process=UPDATE&docId=${item.id}" class="li_write">수정</a></li>
                            <li><a href="javascript:deleteDoc('${item.doc_type}', ${item.id})" class="li_del">삭제</a></li>
                        `;
                    }

                    nodes += `
                                </ul>
                            </div>
                        </li>
                    `;
                });

                $('.tbody').html(nodes);
                makePaging(Math.ceil(docList.total_elements / PAGE_SIZE), PAGE_NO, setDocList);
            }
        }
    );
}

function sortEvent(e, sortType) {
    DOC_SORT_TYPE = sortType;

    if ($(e).hasClass('asc')) {
        $(e).removeClass('asc');
        $(e).addClass('desc');
        IS_ASC = false;

    } else {
        $(e).removeClass('desc');
        $(e).addClass('asc');
        IS_ASC = true;
    }

    setDocList();
}

function sortEventSelect(e) {
    DOC_TYPE = e.value;
    search();
}

// 검색
function search() {
    PAGE_NO = 1;
    setDocList();
}

// 상세
function goDetail(docType, pk) {
    switch (docType) {
        case 'DOC_WORK_PERMIT' :
            docType = 'work-permit';
            break;

        case 'DOC_TIME_WORK_PERMIT' :
            docType = 'time-work-permit';
            break;

        case 'DOC_OBJECT_HANDLING_PLAN' :
            docType = 'object-handling-plan';
            break;

        case 'DOC_SPACE_WORK_PERMIT' :
            docType = 'space-work-permit';
            break;

        case 'DOC_RISK_ASSESSMENT_TABLE' :
            docType = 'risk-assessment-table';
            break;
    }

    formSubmit(`/doc/storage/detail/${docType}/${pk}`);
}

function deleteDoc(docType, docId) {
    if (confirm("삭제하시겠습니까?")) {
        let apiUrl;

        switch (docType) {
            case 'DOC_WORK_PERMIT' :
                apiUrl = '/doc/delete/doc-work-permit';
                break;

            case 'DOC_TIME_WORK_PERMIT' :
                apiUrl = '/doc/delete/doc-time-work-permit';
                break;

            case 'DOC_OBJECT_HANDLING_PLAN' :
                apiUrl = '/doc/delete/doc-object-handling-plan';
                break;

            case 'DOC_SPACE_WORK_PERMIT' :
                apiUrl = '/doc/delete/doc-space-work-permit';
                break;

            case 'DOC_RISK_ASSESSMENT_TABLE' :
                apiUrl = '/doc/delete/doc-risk-assessment-table';
                break;
        }

        callAPI(
            {
                method: "DELETE",
                url: SERVER_URL + apiUrl,
                params: {
                    'docId': docId,
                    'projectId': PROJECT_ID
                }
            },
            function (response) {
                if (response.status === 200) {
                    alert("삭제되었습니다.");
                    formSubmit('/doc/storage/list');
                }
            }
        );
    }
}