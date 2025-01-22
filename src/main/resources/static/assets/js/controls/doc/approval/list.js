const PAGE_SIZE = 10;
let PAGE_NO = 1;
let IS_ASC = true;
let DOC_SORT_TYPE = 'DOCUMENT_STATUS'
let DOC_TYPE = 'ALL'

$(function () {
    setDocList();
    enterKeyEvent($('#s_searchValue'), search);

    $('#is_only_me').on('change', function () {
        setDocList();
    });
});

function setDocList(pageNo) {
    $('.check_parent').hide();
    if (pageNo) PAGE_NO = pageNo;

    callAPI(
        {
            method: "GET",
            url: SERVER_URL + '/doc/list/approval',
            params: {
                'page': PAGE_NO,
                'size': PAGE_SIZE,
                'projectId': PROJECT_ID,
                'userId': USER_ID,
                'isAsc': IS_ASC,
                'docSortType': DOC_SORT_TYPE,
                'docType': DOC_TYPE,
                'keyword': $('#s_searchValue').val(),
                'isOnlyMe': $('#is_only_me').val()
            }
        },
        function (response) {
            if (response.status === 200) {
                const docList = response.data.data;
                let nodes = Number(docList?.total_elements) === 0 ? `<li class="tr"><div class="empty_list">등록된 템플릿이 없습니다.</div></li>` : ``;

                docList?.content?.forEach(function (item, index) {
                    let approvalStatusEl = ``;
                    let approvalButtonEl = ``;
                    let approvalDateEl = ``;

                    /* 상태값 */
                    if (item.approval) {
                        approvalStatusEl = `<span class="fw500 color-blue">결재완료</span>`;
                        approvalDateEl = `<span class="media-mobile-only">결재완료일 : </span>${item.approval_date}`;

                    } else {
                        if (Number(item.seq_user_id === Number(USER_ID))) {
                            approvalStatusEl = `<span class="fw500">결재하기</span>`;

                        } else {
                            if (item.seq > 0) {
                                approvalStatusEl = `<span class="fw500">${item.approver_type} 결재중</span>`;
                            } else {
                                approvalStatusEl = `<span class="fw500">미결재</span>`;
                            }
                        }
                    }

                    /* 버튼 */
                    if (!item.include || item.approval) {
                        approvalButtonEl = `<a href="javascript:goDetail('${item.doc_type}', ${item.id})" class="_btn/line/md/blue ml10">결과보기</a>`;

                    } else {
                        if (item.include && !item.remain) {
                            approvalButtonEl = `<a href="javascript:goDetail('${item.doc_type}', ${item.id})" class="_btn/line/md/green ml10">결재중</a>`;

                        } else {
                            if (Number(item.seq_user_id === Number(USER_ID))) {
                                approvalButtonEl = `<a href="javascript:goDetail('${item.doc_type}', ${item.id})" class="_btn/line/md/green ml10">결재하기</a>`;
                            } else {
                                approvalButtonEl = `<a href="javascript:goDetail('${item.doc_type}', ${item.id})" class="_btn/line/md/green ml10">결재대기</a>`;
                            }
                        }
                    }

                    let docType = '';
                    let printType = '';

                    switch (item.doc_type) {
                        case 'DOC_WORK_PERMIT' :
                            docType = 'work-permit';
                            printType = 'print_vertical';
                            break;

                        case 'DOC_TIME_WORK_PERMIT' :
                            docType = 'time-work-permit';
                            printType = 'print_vertical';
                            break;

                        case 'DOC_OBJECT_HANDLING_PLAN' :
                            docType = 'object-handling-plan';
                            printType = 'print_vertical';
                            break;

                        case 'DOC_SPACE_WORK_PERMIT' :
                            docType = 'space-work-permit';
                            printType = 'print_vertical';
                            break;

                        case 'DOC_RISK_ASSESSMENT_TABLE' :
                            docType = 'risk-assessment-table';
                            printType = 'print_horizontal';
                            break;
                    }

                    nodes += `
                        <li class="tr">
                            <div class="cell_input"><label class="checkbox-wrap"><input class="check_child ${printType}" type="checkbox" data-print_type="${printType}" value="${item.doc_type}^^${item.id}"><span></span></label></div>
                            <div class="cell_num">${makeListNo(docList?.total_elements, index, PAGE_NO, PAGE_SIZE)}</div>
                            <div class="cell_subject"><span class="cursor-pointer" onclick="goDetail('${item.doc_type}', ${item.id})">${item.document_name}</div>
                            <div class="cell_name">${item.user_name}</div>
                            <div class="cell_16">${approvalStatusEl}${approvalButtonEl}</div>
                            <div class="cell_date">${item.created_at}</div>
                            <div class="cell_date2 mobile_block">${approvalDateEl}</div>
                            <div class="cell_btnSet">
                                <ul>
                                    <li><a href="/doc/approval/write/${docType}?process=COPY&docId=${item.id}" class="li_copy">복사</a></li>
                                    <li><a href="javascript:clickDocPrint('${item.doc_type}', '${item.id}');" class="li_print">인쇄</a></li>
                    `;

                    // 내가 작성한 게시물만 수정, 삭제가 가능함
                    let isMine = false;
                    if (Number(USER_ID) === Number(item.user_id)) isMine = true;
                    if (isMine) {
                        nodes += `<li><a href="javascript:deleteDoc('${item.doc_type}', ${item.id})" class="li_del">삭제</a></li>`;
                    }

                    nodes += `
                                </ul>
                            </div>
                        </li>
                    `;
                });

                $('.tbody').html(nodes);
                makePaging(Math.ceil(docList.total_elements / PAGE_SIZE), PAGE_NO, setDocList);

                // 체크박스 관련 로직
                const checkPrent = $('.check_parent');
                checkPrent.prop('checked',false);
                setCheckBoxClickEvent();
            }
        }
    );
}

// 체크박스 클릭시 이벤트
function setCheckBoxClickEvent() {
    const checkChild = $('.check_child');
    const checkParent = $('.check_parent');

    // 부모 체크박스 이벤트
    checkParent.on('click',function() {
        if($(this).is(':checked')) { // 부모 체크박스 체크하면
            // dispaly !== none 인 자식 체크박스들 체크시킴
            $(checkChild).parent().filter(':visible').children().prop('checked', true);

        }else { // 부모 체크박스 해제하면
            // 부모 체크박스 숨김
            checkParent.parent().hide();
            // 자식 체크박스 전체 보여줌
            checkChild.parent().show();
            // 자식 체크박스 체크 해제시킴
            $(checkChild).prop('checked',false);
        }
    });

    // 자식 체크박스 이벤트
    checkChild.on('click',function() {
        const target = $('#selected_doc_print');
        const printType = $(this).data('print_type');

        if(checkChild.filter(':checked').length === 1) {
            if(printType === 'print_horizontal') {
                // 처음 체크한게 가로 인쇄 문서인 경우 세로 문서 체크박스 숨김
                $('.print_vertical').parent().hide();
            }else {
                // 처음 체크한게 세로 인쇄 문서인 경우 가로 문서 체크박스 숨김
                $('.print_horizontal').parent().hide();
            }
        }

        if(checkChild.filter(':checked').length > 0) {
            // 체크된게 하나라도 있으면 선택 문서 인쇄 버튼 활성화
            target.attr("disabled", false);
            target.removeClass('_btn/md/line');
            target.addClass('_btn/line/md/blue');

            // 체크된게 하나라도 있으면 전체선택 체크박스 보여줌
            checkParent.parent().show();

        }else {
            // 체크된게 없으면 선택 문서 인쇄 버튼 비활성화
            target.attr("disabled", true);
            target.addClass('_btn/md/line');
            target.removeClass('_btn/line/md/blue');

            // 체크된게 없으면 모든 하위선택 체크박스 보여줌
            checkChild.parent().show();

            // 체크된게 없으면 전체선택 체크박스 숨김
            checkParent.parent().hide();
        }

        // 자식 체크박스가 모두 체크된 상태면
        if(checkChild.parent().filter(':visible').find('input[type=checkbox]:checked').length === checkChild.parent().filter(':visible').length) {
            // 부모 체크박스 체크시킴
            $(checkParent).prop('checked',true);
        }else {
            $(checkParent).prop('checked',false);
        }
    });
}

// 정렬 이벤트
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
    setDocList();
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

    formSubmit(`/doc/approval/detail/${docType}/${pk}`);
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
                    formSubmit('/doc/approval/list');
                }
            }
        );
    }
}

// 프린트 버튼 클릭
async function clickDocPrint(docType, id) {
    const contentsData = await getContentsData(docType, id);
    setPrintContents(docType, contentsData);
    clickPrintBtn(docType);
}

// 프린트 내용 가져오기
async function getContentsData(docType, id) {
    let contentsData;
    let subUrl = '';

    switch (docType) {
        case 'DOC_WORK_PERMIT' :
            subUrl = '/doc/detail/doc-work-permit';
            break;

        case 'DOC_TIME_WORK_PERMIT' :
            subUrl = '/doc/detail/doc-time-work-permit';
            break;

        case 'DOC_OBJECT_HANDLING_PLAN' :
            subUrl = '/doc/detail/doc-object-handling-plan';
            break;

        case 'DOC_SPACE_WORK_PERMIT' :
            subUrl = '/doc/detail/doc-space-work-permit';
            break;

        case 'DOC_RISK_ASSESSMENT_TABLE' :
            subUrl = '/doc/detail/doc-risk-assessment-table';
            break;
    }

    await callAPI(
        {
            method: "GET",
            url: SERVER_URL + subUrl,
            params: {
                projectId: PROJECT_ID,
                id: id
            }
        },
        function (response) {
            if (response.status === 200) {
                contentsData = response.data.data;
            }
        }
    );

    return contentsData;
}

// 선택 문서 인쇄 - 버튼 클릭
function clickSelectedDocPrint() {
    new Promise(resolve => {
        // 인쇄 화면 로드 될때까지 선택 문서 인쇄 버튼 비활성화
        $('#selected_doc_print').attr("disabled", true);
        resolve();
    })
    .then(() => {
        return getSelectedDocPrintHtml();

    })
    .then((result1) => {
        return showSelectedDocPrint(result1);

    })
    .then((result2) => {
        if($('.check_child').parent().filter(':visible').find('input[type=checkbox]').eq(0).data('print_type') === 'print_vertical') {
            // 세로 문서인 경우
            $('#_pop_print_all .popContainer').css('width','210mm');
            $('#_pop_print_all .btn_print').on("click", function() {
                docPrint('print_all_main',removeLine,addLine,false);
            });
        }else {
            // 가로 문서인 경우
            $('#_pop_print_all .popContainer').css('width','297mm');
            $('#_pop_print_all .btn_print').on("click", function() {
                docPrint('print_all_main',removeLine,addLine,true);
            });
        }

        // 인쇄 화면 로드 끝나면 선택 문서 인쇄 버튼 활성화
        if(result2) $('#selected_doc_print').attr("disabled", false);
    });
}

// 선택 문서 인쇄 - 문서들 전체 html 조합 가져오기
async function getSelectedDocPrintHtml() {
    let allPrintHtml = '';

    for (const item of $('.check_child:checked')) {
        const valueSplit = $(item).val().split('^^');
        const docType = valueSplit[0];
        const docId = valueSplit[1];

        const contentsData = await getContentsData(docType, docId);
        setPrintContents(docType, contentsData);

        let target = '';
        switch (docType) {
            case 'DOC_WORK_PERMIT' : target = '#_pop_print_doc1'; break;
            case 'DOC_TIME_WORK_PERMIT' : target = '#_pop_print_doc3'; break;
            case 'DOC_OBJECT_HANDLING_PLAN' : target = '#_pop_print_doc2'; break;
            case 'DOC_SPACE_WORK_PERMIT' : target = '#_pop_print_doc4'; break;
            case 'DOC_RISK_ASSESSMENT_TABLE' : target = '#_pop_print_doc5'; break;
        }

        allPrintHtml += $(target).find('.popContainer .inner').html();
    }

    return allPrintHtml;
}